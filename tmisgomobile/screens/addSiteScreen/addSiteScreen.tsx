

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { gql} from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import Icon from '@react-native-vector-icons/ionicons';
// import { launchImageLibrary } from 'react-native-image-picker';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../../constants/constants';

// ─── Design Tokens (consistent with rest of app) ──────────────────────────────
const C = {
  bg: '#F4F6F9',
  surface: '#FFFFFF',
  dark: '#1A1D23',
  primary: '#FF6B35',
  primarySoft: '#FFF0EB',
  blue: '#3B82F6',
  blueSoft: '#EFF6FF',
  green: '#22C55E',
  text: '#1A1D23',
  textSub: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  inputBorder: '#D1D5DB',
  error: '#EF4444',
  errorSoft: '#FEF2F2',
  white: '#FFFFFF',
};

// ─── GraphQL ──────────────────────────────────────────────────────────────────
const CREATE_SITE_MUTATION = gql`
  mutation CreateSite($userId: ID!, $name: String!, $endDate: String!, $logoUrl: String) {
    createSite(userId: $userId, name: $name, endDate: $endDate, logoUrl: $logoUrl) {
      _id
      name
      logoUrl
      status
      daysLeft
      progress
      notificationCount
    }
  }
`;

// ─── Date Picker (simple inline calendar strip) ───────────────────────────────
const MonthYearPicker = ({
  value,
  onChange,
}: {
  value: Date | null;
  onChange: (d: Date) => void;
}) => {
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <View style={styles.calendarWrap}>
      {/* Month nav */}
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={prevMonth} style={styles.calNavBtn}>
          <Icon name="chevron-back" size={18} color={C.text} />
        </TouchableOpacity>
        <Text style={styles.calMonthLabel}>
          {MONTHS[viewMonth]} {viewYear}
        </Text>
        <TouchableOpacity onPress={nextMonth} style={styles.calNavBtn}>
          <Icon name="chevron-forward" size={18} color={C.text} />
        </TouchableOpacity>
      </View>

      {/* Day headers */}
      <View style={styles.calDayHeaders}>
        {DAYS.map(d => (
          <Text key={d} style={styles.calDayHeader}>{d}</Text>
        ))}
      </View>

      {/* Day grid */}
      <View style={styles.calGrid}>
        {cells.map((day, idx) => {
          if (!day) return <View key={`empty-${idx}`} style={styles.calCell} />;

          const cellDate = new Date(viewYear, viewMonth, day);
          cellDate.setHours(0, 0, 0, 0);
          const isPast = cellDate < today;
          const isSelected =
            value &&
            value.getDate() === day &&
            value.getMonth() === viewMonth &&
            value.getFullYear() === viewYear;

          return (
            <TouchableOpacity
              key={day}
              style={[
                styles.calCell,
                isSelected && styles.calCellSelected,
                isPast && styles.calCellDisabled,
              ]}
              onPress={() => !isPast && onChange(new Date(viewYear, viewMonth, day))}
              disabled={isPast}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.calCellText,
                  isSelected && styles.calCellTextSelected,
                  isPast && styles.calCellTextDisabled,
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const AddSiteScreen = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.authSlice);

  // Form state
  const [siteName, setSiteName] = useState('');
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<any>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Upload state
  const [uploading, setUploading] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<{ name?: string; endDate?: string }>({});

  const [createSite, { loading: mutationLoading }] = useMutation(CREATE_SITE_MUTATION, {
    onCompleted: () => {
      Alert.alert('Success', 'Site created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    },
    onError: (err) => {
      Alert.alert('Error', `Failed to create site: ${err.message}`);
    },
  });

  // ─── Logo picker ───────────────────────────────────────────────────────────
  const handlePickLogo = useCallback(() => {
    // launchImageLibrary(
    //   { mediaType: 'photo', quality: 0.8, maxWidth: 800, maxHeight: 800 },
    //   (response) => {
    //     if (response.didCancel || response.errorCode) return;
    //     const asset = response.assets?.[0];
    //     if (!asset) return;

    //     if ((asset.fileSize ?? 0) > 5 * 1024 * 1024) {
    //       Alert.alert('File too large', 'Please choose an image under 5MB.');
    //       return;
    //     }
    //     setLogoUri(asset.uri ?? null);
    //     setLogoFile(asset);
    //   }
    // );
  }, []);

  const handleRemoveLogo = () => {
    setLogoUri(null);
    setLogoFile(null);
  };

  // ─── Cloudinary upload ─────────────────────────────────────────────────────
  const uploadToCloudinary = async (asset: any): Promise<string> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: asset.uri,
        type: asset.type ?? 'image/jpeg',
        name: asset.fileName ?? 'logo.jpg',
      } as any);
      formData.append('upload_preset',CLOUDINARY_UPLOAD_PRESET ?? '');
      formData.append('folder', 'saitiyo/sites');
      formData.append('quality', 'auto');

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      return data.secure_url;
    } finally {
      setUploading(false);
    }
  };

  // ─── Validation ────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!siteName.trim() || siteName.trim().length < 3) {
      newErrors.name = 'Site name must be at least 3 characters';
    }
    if (siteName.trim().length > 100) {
      newErrors.name = 'Site name must not exceed 100 characters';
    }
    if (!endDate) {
      newErrors.endDate = 'Project end date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    if (!user) {
      Alert.alert('Error', 'User not found. Please log in again.');
      return;
    }

    try {
      let logoUrl = '';
      if (logoFile) {
        logoUrl = await uploadToCloudinary(logoFile);
      }

      await createSite({
        variables: {
          userId: user._id,
          name: siteName.trim(),
          endDate: endDate!.toISOString(),
          logoUrl: logoUrl || undefined,
        },
      });
    } catch (err) {
      console.error('Submit error:', err);
      Alert.alert('Error', 'Failed to create site. Please try again.');
    }
  };

  const isLoading = uploading || mutationLoading;

  const fmtDate = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={20} color={C.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Create New Site</Text>
          <Text style={styles.headerSub}>Set up a new construction project</Text>
        </View>
      </View>

      {/* ── Form Card ──────────────────────────────────── */}
      <View style={styles.card}>

        {/* Site Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Site Name <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, errors.name ? styles.inputError : null]}
            placeholder="e.g., Downtown Plaza Construction"
            placeholderTextColor={C.textMuted}
            value={siteName}
            onChangeText={(t) => { setSiteName(t); setErrors(e => ({ ...e, name: undefined })); }}
            editable={!isLoading}
            maxLength={100}
            returnKeyType="next"
          />
          {errors.name && (
            <Text style={styles.errorText}>{errors.name}</Text>
          )}
        </View>

        {/* End Date */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Project End Date <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity
            style={[styles.input, styles.dateInput, errors.endDate ? styles.inputError : null]}
            onPress={() => { if (!isLoading) setShowCalendar(v => !v); }}
            activeOpacity={0.7}
          >
            <Text style={endDate ? styles.dateText : styles.datePlaceholder}>
              {endDate ? fmtDate(endDate) : 'Select completion date'}
            </Text>
            <Icon
              name={showCalendar ? 'chevron-up' : 'calendar-outline'}
              size={18}
              color={endDate ? C.text : C.textMuted}
            />
          </TouchableOpacity>
          {errors.endDate && (
            <Text style={styles.errorText}>{errors.endDate}</Text>
          )}

          {showCalendar && (
            <MonthYearPicker
              value={endDate}
              onChange={(d) => {
                setEndDate(d);
                setShowCalendar(false);
                setErrors(e => ({ ...e, endDate: undefined }));
              }}
            />
          )}
        </View>

        {/* Logo Upload */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Site Logo <Text style={styles.optional}>(Optional)</Text></Text>

          {logoUri ? (
            // Preview state
            <View style={styles.logoPreviewWrap}>
              <Image source={{ uri: logoUri }} style={styles.logoPreview} resizeMode="cover" />
              <View style={styles.logoPreviewMeta}>
                <Text style={styles.logoPreviewName} numberOfLines={1}>Logo selected</Text>
                <Text style={styles.logoPreviewSub}>
                  {logoFile?.fileSize
                    ? `${(logoFile.fileSize / 1024 / 1024).toFixed(1)} MB`
                    : ''}
                </Text>
                <View style={styles.logoPreviewActions}>
                  <TouchableOpacity
                    onPress={handlePickLogo}
                    style={styles.logoActionBtn}
                    disabled={isLoading}
                  >
                    <Icon name="camera-outline" size={14} color={C.primary} />
                    <Text style={[styles.logoActionText, { color: C.primary }]}>Change</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleRemoveLogo}
                    style={[styles.logoActionBtn, { marginLeft: 12 }]}
                    disabled={isLoading}
                  >
                    <Icon name="trash-outline" size={14} color={C.error} />
                    <Text style={[styles.logoActionText, { color: C.error }]}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            // Empty state
            <TouchableOpacity
              style={styles.dropzone}
              onPress={handlePickLogo}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <View style={styles.dropzoneIcon}>
                <Icon name="camera-outline" size={28} color={C.textMuted} />
              </View>
              <Text style={styles.dropzoneTitle}>Upload site logo</Text>
              <Text style={styles.dropzoneSub}>PNG, JPG or WebP · Max 5MB</Text>
              <View style={styles.browseBtn}>
                <Text style={styles.browseBtnText}>Browse Files</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Pro Tip */}
        <View style={styles.tipBox}>
          <Icon name="information-circle-outline" size={18} color={C.blue} style={{ marginTop: 1 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>Pro Tip</Text>
            <Text style={styles.tipText}>
              You can manage team members and track progress after creating the site.
            </Text>
          </View>
        </View>
      </View>

      {/* ── Info Cards ─────────────────────────────────── */}
      <View style={styles.infoRow}>
        <View style={styles.infoCard}>
          <Text style={styles.infoEmoji}>📋</Text>
          <Text style={styles.infoTitle}>What's Next?</Text>
          <Text style={styles.infoText}>
            After creating your site, add team members, upload files, and track progress.
          </Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoEmoji}>⚙️</Text>
          <Text style={styles.infoTitle}>Requirements</Text>
          <Text style={styles.infoText}>
            You need a site name and end date to proceed. Logo is optional but recommended.
          </Text>
        </View>
      </View>

      {/* ── Action Buttons ──────────────────────────────── */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <View style={styles.submitBtnInner}>
              <ActivityIndicator size="small" color={C.white} />
              <Text style={styles.submitBtnText}>
                {uploading ? 'Uploading...' : 'Creating...'}
              </Text>
            </View>
          ) : (
            <Text style={styles.submitBtnText}>Create Site</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },
  container: {
    padding: 16,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 20,
    paddingTop: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.dark,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 13,
    color: C.textSub,
    marginTop: 2,
    fontWeight: '500',
  },

  // Card
  card: {
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: C.dark,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 16,
  },

  // Field
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: C.text,
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  required: {
    color: C.error,
  },
  optional: {
    color: C.textMuted,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1.5,
    borderColor: C.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: C.text,
    backgroundColor: C.surface,
  },
  inputError: {
    borderColor: C.error,
    backgroundColor: C.errorSoft,
  },
  errorText: {
    fontSize: 12,
    color: C.error,
    fontWeight: '500',
    marginTop: 5,
    marginLeft: 2,
  },

  // Date input
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 14,
    color: C.text,
    fontWeight: '500',
  },
  datePlaceholder: {
    fontSize: 14,
    color: C.textMuted,
  },

  // Calendar
  calendarWrap: {
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 14,
    padding: 12,
    backgroundColor: C.surface,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  calNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calMonthLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: C.text,
  },
  calDayHeaders: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  calDayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: C.textMuted,
    textTransform: 'uppercase',
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calCell: {
    width: `${100 / 7}%` as any,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  calCellSelected: {
    backgroundColor: C.primary,
  },
  calCellDisabled: {
    opacity: 0.3,
  },
  calCellText: {
    fontSize: 13,
    fontWeight: '500',
    color: C.text,
  },
  calCellTextSelected: {
    color: C.white,
    fontWeight: '700',
  },
  calCellTextDisabled: {
    color: C.textMuted,
  },

  // Logo dropzone
  dropzone: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: C.inputBorder,
    borderRadius: 14,
    paddingVertical: 28,
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FAFAFA',
  },
  dropzoneIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  dropzoneTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
  },
  dropzoneSub: {
    fontSize: 12,
    color: C.textMuted,
    fontWeight: '500',
  },
  browseBtn: {
    marginTop: 8,
    backgroundColor: C.dark,
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 10,
  },
  browseBtnText: {
    color: C.white,
    fontSize: 13,
    fontWeight: '700',
  },

  // Logo preview
  logoPreviewWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 14,
    backgroundColor: '#FAFAFA',
  },
  logoPreview: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: C.bg,
  },
  logoPreviewMeta: {
    flex: 1,
  },
  logoPreviewName: {
    fontSize: 13,
    fontWeight: '600',
    color: C.text,
  },
  logoPreviewSub: {
    fontSize: 11,
    color: C.textMuted,
    marginTop: 2,
  },
  logoPreviewActions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  logoActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  logoActionText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Pro Tip
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: C.blueSoft,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: C.text,
    marginBottom: 2,
  },
  tipText: {
    fontSize: 12,
    color: C.textSub,
    lineHeight: 18,
    fontWeight: '500',
  },

  // Info cards
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 14,
    shadowColor: C.dark,
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  infoEmoji: {
    fontSize: 20,
    marginBottom: 6,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: C.text,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 11,
    color: C.textSub,
    lineHeight: 16,
    fontWeight: '500',
  },

  // Actions
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.inputBorder,
    alignItems: 'center',
    backgroundColor: C.surface,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: C.textSub,
  },
  submitBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: C.dark,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.dark,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: C.white,
    letterSpacing: 0.2,
  },
});

export default AddSiteScreen;