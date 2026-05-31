import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigation } from '@react-navigation/native';
import Icon from '@react-native-vector-icons/ionicons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 12) / 2;

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#F4F6F9',
  surface: '#FFFFFF',
  dark: '#1A1D23',
  darkCard: '#22262E',
  primary: '#FF6B35',       // construction orange
  primarySoft: '#FFF0EB',
  blue: '#3B82F6',
  blueSoft: '#EFF6FF',
  green: '#22C55E',
  greenSoft: '#F0FDF4',
  amber: '#F59E0B',
  amberSoft: '#FFFBEB',
  purple: '#8B5CF6',
  purpleSoft: '#F5F3FF',
  text: '#1A1D23',
  textSub: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  white: '#FFFFFF',
};

// ─── Animated Stat Card ───────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  icon:any;
  accent: string;
  accentSoft: string;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  label, value, icon, accent, accentSoft, trend, trendUp, delay = 0,
}) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      delay,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.statCard,
        {
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
        },
      ]}
    >
      <View style={[styles.statIconWrap, { backgroundColor: accentSoft }]}>
        <Icon name={icon} size={20} color={accent} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {trend && (
        <View style={styles.trendRow}>
          <Icon
            name={trendUp ? 'trending-up' : 'trending-down'}
            size={12}
            color={trendUp ? C.green : C.primary}
          />
          <Text style={[styles.trendText, { color: trendUp ? C.green : C.primary }]}>
            {' '}{trend}
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

// ─── Mini Donut ───────────────────────────────────────────────────────────────
interface MiniDonutProps {
  percent: number;
  color: string;
  size?: number;
}

const MiniDonut: React.FC<MiniDonutProps> = ({ percent, color, size = 48 }) => {
  // SVG-like using View trick — pure RN approach
  const r = size / 2;
  const strokeWidth = 6;
  const filled = Math.round(percent);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* background ring */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: r,
          borderWidth: strokeWidth,
          borderColor: C.border,
          position: 'absolute',
        }}
      />
      {/* progress arc (approximation using border trick) */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: r,
          borderWidth: strokeWidth,
          borderTopColor: color,
          borderRightColor: filled > 50 ? color : 'transparent',
          borderBottomColor: filled > 75 ? color : 'transparent',
          borderLeftColor: filled > 25 ? color : 'transparent',
          position: 'absolute',
          transform: [{ rotate: '-45deg' }],
        }}
      />
      <Text style={{ fontSize: 10, fontWeight: '700', color: C.text }}>
        {filled}%
      </Text>
    </View>
  );
};

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ title, onPress }: { title: string; onPress?: () => void }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {onPress && (
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.seeAll}>See all</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─── Task Item ────────────────────────────────────────────────────────────────
interface TaskItemProps {
  title: string;
  assignee: string;
  due: string;
  priority: 'high' | 'medium' | 'low';
  progress: number;
}

const priorityMeta = {
  high: { color: C.primary, label: 'High' },
  medium: { color: C.amber, label: 'Med' },
  low: { color: C.green, label: 'Low' },
};

const TaskItem: React.FC<TaskItemProps> = ({ title, assignee, due, priority, progress }) => {
  const { color, label } = priorityMeta[priority];
  return (
    <View style={styles.taskItem}>
      <View style={styles.taskLeft}>
        <View style={[styles.priorityDot, { backgroundColor: color }]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.taskTitle} numberOfLines={1}>{title}</Text>
          <Text style={styles.taskSub}>{assignee} · Due {due}</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%` as any, backgroundColor: color }]} />
          </View>
        </View>
      </View>
      <View style={[styles.priorityBadge, { backgroundColor: color + '20' }]}>
        <Text style={[styles.priorityText, { color }]}>{label}</Text>
      </View>
    </View>
  );
};

// ─── Team Member ──────────────────────────────────────────────────────────────
const TeamMember = ({
  name, role, status,
}: {
  name: string; role: string; status: 'on-site' | 'off-site';
}) => (
  <View style={styles.memberRow}>
    <View style={styles.memberAvatar}>
      <Text style={styles.memberInitial}>{name[0]}</Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.memberName}>{name}</Text>
      <Text style={styles.memberRole}>{role}</Text>
    </View>
    <View style={[
      styles.memberStatusBadge,
      { backgroundColor: status === 'on-site' ? C.greenSoft : C.border },
    ]}>
      <View style={[
        styles.statusDot,
        { backgroundColor: status === 'on-site' ? C.green : C.textMuted },
      ]} />
      <Text style={[
        styles.statusText,
        { color: status === 'on-site' ? C.green : C.textSub },
      ]}>
        {status === 'on-site' ? 'On Site' : 'Off Site'}
      </Text>
    </View>
  </View>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const DashboardScreen = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.authSlice);
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const firstName = user?.firstName ?? 'Manager';
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerAnim,
            transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] }) }],
          },
        ]}
      >
        <View>
          <Text style={styles.headerDate}>{today}</Text>
          <Text style={styles.headerGreeting}>
            Good morning, <Text style={styles.headerName}>{firstName}</Text>
          </Text>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Icon name="notifications-outline" size={22} color={C.text} />
          <View style={styles.notifBadge} />
        </TouchableOpacity>
      </Animated.View>

      {/* ── Stat Cards ─────────────────────────────────── */}
      <View style={styles.statsGrid}>
        <StatCard
          label="Active Contracts"
          value="24"
          icon="document-text-outline"
          accent={C.primary}
          accentSoft={C.primarySoft}
          trend="↑ 12% vs last month"
          trendUp
          delay={0}
        />
        <StatCard
          label="Upcoming Deadlines"
          value="10"
          icon="calendar-outline"
          accent={C.blue}
          accentSoft={C.blueSoft}
          trend="↑ 4 new"
          trendUp={false}
          delay={80}
        />
        <StatCard
          label="Budget Summary"
          value="$12M"
          icon="cash-outline"
          accent={C.green}
          accentSoft={C.greenSoft}
          trend="On track"
          trendUp
          delay={160}
        />
        <StatCard
          label="Progress Status"
          value="10/24"
          icon="stats-chart-outline"
          accent={C.purple}
          accentSoft={C.purpleSoft}
          trend="42% complete"
          trendUp
          delay={240}
        />
      </View>

      {/* ── Progress Overview ──────────────────────────── */}
      <View style={styles.card}>
        <SectionHeader title="Project Overview" />
        <View style={styles.overviewRow}>
          {[
            { label: 'Foundation', pct: 95, color: C.green },
            { label: 'Structure', pct: 72, color: C.primary },
            { label: 'Electrical', pct: 48, color: C.blue },
            { label: 'Finishing', pct: 20, color: C.amber },
          ].map(item => (
            <View key={item.label} style={styles.overviewItem}>
              <MiniDonut percent={item.pct} color={item.color} size={52} />
              <Text style={styles.overviewLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Quick Actions ──────────────────────────────── */}
      <View style={styles.card}>
        <SectionHeader title="Quick Actions" />
        <View style={styles.actionsRow}>
          {[
            { icon: 'clipboard-outline', label: 'New Task', screen: 'UpdateProfileHome', color: C.primary },
            { icon: 'people-outline', label: 'Team', screen: 'AddPictures', color: C.blue },
            { icon: 'folder-outline', label: 'Documents', screen: 'AddMinimumBookingFee', color: C.green },
            { icon: 'construct-outline', label: 'Equipment', screen: 'Equipment', color: C.amber },
          ].map(action => (
            <TouchableOpacity
              key={action.label}
              style={styles.actionBtn}
              onPress={() => (navigation as any).navigate(action.screen)}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIconWrap, { backgroundColor: action.color }]}>
                <Icon name={action.icon as any} size={20} color={C.white} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Recent Tasks ───────────────────────────────── */}
      <View style={styles.card}>
        <SectionHeader title="Recent Tasks" onPress={() => (navigation as any).navigate('TaskBoard')} />
        <TaskItem
          title="Install roof insulation – Block C"
          assignee="J. Omondi"
          due="Mar 15"
          priority="high"
          progress={35}
        />
        <TaskItem
          title="Electrical wiring – 2nd Floor"
          assignee="A. Kamau"
          due="Mar 18"
          priority="medium"
          progress={60}
        />
        <TaskItem
          title="Paint interior walls – Block A"
          assignee="M. Wanjiru"
          due="Mar 22"
          priority="low"
          progress={80}
        />
      </View>

      {/* ── Team On Site ───────────────────────────────── */}
      <View style={styles.card}>
        <SectionHeader title="Team On Site" onPress={() => (navigation as any).navigate('Team')} />
        <View style={styles.teamSummaryRow}>
          <View style={styles.teamSummaryItem}>
            <Text style={styles.teamSummaryVal}>24</Text>
            <Text style={styles.teamSummaryLbl}>Active Members</Text>
          </View>
          <View style={styles.teamDivider} />
          <View style={styles.teamSummaryItem}>
            <Text style={styles.teamSummaryVal}>52</Text>
            <Text style={styles.teamSummaryLbl}>Support Staff</Text>
          </View>
          <View style={styles.teamDivider} />
          <View style={styles.teamSummaryItem}>
            <Text style={[styles.teamSummaryVal, { color: C.green }]}>50</Text>
            <Text style={styles.teamSummaryLbl}>Currently On Site</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <TeamMember name="Kirttu Muss" role="Project Manager" status="on-site" />
        <TeamMember name="Alex Njoroge" role="Site Engineer" status="on-site" />
        <TeamMember name="Mary Achieng" role="Safety Officer" status="off-site" />
        <TouchableOpacity style={styles.viewAllBtn} onPress={() => (navigation as any).navigate('Team')}>
          <Text style={styles.viewAllText}>Go to Team Members</Text>
          <Icon name="arrow-forward" size={16} color={C.dark} />
        </TouchableOpacity>
      </View>

      {/* ── Budget Bar ─────────────────────────────────── */}
      <View style={[styles.card, styles.budgetCard]}>
        <Text style={styles.budgetTitle}>Budget Utilization</Text>
        <Text style={styles.budgetAmount}>$8.4M <Text style={styles.budgetOf}>of $12M</Text></Text>
        <View style={styles.budgetBarBg}>
          <View style={[styles.budgetBarFill, { width: '70%' }]} />
        </View>
        <View style={styles.budgetLegend}>
          <Text style={styles.budgetLegendText}>70% utilized</Text>
          <Text style={styles.budgetLegendText}>30% remaining</Text>
        </View>
        <View style={styles.budgetBreakdown}>
          {[
            { label: 'Labour', pct: 38, color: C.primary },
            { label: 'Materials', pct: 45, color: C.blue },
            { label: 'Other', pct: 17, color: C.amber },
          ].map(b => (
            <View key={b.label} style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: b.color }]} />
              <Text style={styles.breakdownLabel}>{b.label}</Text>
              <Text style={[styles.breakdownPct, { color: b.color }]}>{b.pct}%</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ height: 24 }} />
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
    paddingBottom: 32,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 8,
  },
  headerDate: {
    fontSize: 12,
    color: C.textMuted,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  headerGreeting: {
    fontSize: 22,
    fontWeight: '600',
    color: C.text,
  },
  headerName: {
    color: C.primary,
    fontWeight: '800',
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.dark,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  notifBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.primary,
    borderWidth: 1.5,
    borderColor: C.surface,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: CARD_WIDTH,
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 14,
    shadowColor: C.dark,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    color: C.textSub,
    marginTop: 2,
    fontWeight: '500',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Card container
  card: {
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: C.dark,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: C.text,
    letterSpacing: -0.2,
  },
  seeAll: {
    fontSize: 13,
    color: C.primary,
    fontWeight: '600',
  },

  // Project Overview
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overviewItem: {
    alignItems: 'center',
    gap: 6,
  },
  overviewLabel: {
    fontSize: 11,
    color: C.textSub,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Quick Actions
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    alignItems: 'center',
    flex: 1,
  },
  actionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: C.dark,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  actionLabel: {
    fontSize: 11,
    color: C.textSub,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Task Items
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 10,
  },
  taskLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 2,
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: C.text,
    marginBottom: 2,
  },
  taskSub: {
    fontSize: 11,
    color: C.textMuted,
    marginBottom: 6,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: C.border,
    borderRadius: 2,
    width: '100%',
  },
  progressBarFill: {
    height: 4,
    borderRadius: 2,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Team
  teamSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 14,
  },
  teamSummaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  teamSummaryVal: {
    fontSize: 22,
    fontWeight: '800',
    color: C.text,
  },
  teamSummaryLbl: {
    fontSize: 10,
    color: C.textMuted,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },
  teamDivider: {
    width: 1,
    height: 36,
    backgroundColor: C.border,
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginBottom: 12,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInitial: {
    color: C.white,
    fontSize: 14,
    fontWeight: '700',
  },
  memberName: {
    fontSize: 13,
    fontWeight: '600',
    color: C.text,
  },
  memberRole: {
    fontSize: 11,
    color: C.textMuted,
    fontWeight: '500',
  },
  memberStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 10,
    backgroundColor: C.bg,
    borderRadius: 10,
    gap: 6,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.dark,
  },

  // Budget Card
  budgetCard: {
    backgroundColor: C.dark,
  },
  budgetTitle: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: C.white,
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  budgetOf: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  budgetBarBg: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    marginBottom: 8,
  },
  budgetBarFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: C.primary,
  },
  budgetLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  budgetLegendText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  budgetBreakdown: {
    flexDirection: 'row',
    gap: 16,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  breakdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  breakdownLabel: {
    fontSize: 11,
    color: '#D1D5DB',
    fontWeight: '500',
  },
  breakdownPct: {
    fontSize: 11,
    fontWeight: '700',
  },
});

export default DashboardScreen;