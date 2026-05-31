import CustomAppBar from "../../components/CustomAppBar/CustomAppBar"
import CustomButton from "../../components/CustomBotton/CustomButton";
import SafeAreaContainer from "../../components/SafeAreaContainer/SafeAreaContainer"
import colors from "../../constants/Colors";
import { dimentions } from "../../constants/dimentions";
import { useNavigation } from "@react-navigation/native";
import { useRef, useState, useEffect } from "react";
import { 
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ToastAndroid,
  Animated,
  Dimensions 
} from "react-native";
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera";
import { screenNames } from "../../navigation/screenNames";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { setPhoto } from "../../redux/feature/auth.feature";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CaptureDocument = () => {
  const navigation: any = useNavigation()
  const dispatch = useAppDispatch()
  const { uploadSide } = useSelector((state: RootState) => state.authSlice)

  const camera = useRef<Camera>(null)
  const device = useCameraDevice('back')
  const { hasPermission, requestPermission } = useCameraPermission()
  
  const [isCapturing, setIsCapturing] = useState(false)
  const [torchOn, setTorchOn] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  
  // Animation values
  const scanAnimation = useRef(new Animated.Value(0)).current
  const pulseAnimation = useRef(new Animated.Value(1)).current

  useEffect(() => {
    // Start scanning animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation for capture button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  if (!hasPermission) {
    return (
      <SafeAreaContainer>
        <View style={styles.container}>
          <Text style={styles.message}>We need your permission to access your camera</Text>
          <CustomButton onPress={() => requestPermission()} title="grant permission" />
        </View>
      </SafeAreaContainer>
    );
  }

  if (device == null) {
    return (
      <SafeAreaContainer>
        <View style={styles.container}>
          <Text style={styles.message}>It looks like you have no back camera</Text>
        </View>
      </SafeAreaContainer>
    );
  }

  const getDocumentGuidance = () => {
    switch (uploadSide) {
      case 'front':
        return "Align the FRONT of your ID within the frame. Ensure all text is visible and clear.";
      case 'back':
        return "Align the BACK of your ID within the frame. Ensure the barcode and all details are visible.";
      default:
        return "Align your document within the frame. Ensure all details are clear and readable.";
    }
  };

  const getTips = () => {
    return [
      "• Place ID on a dark, flat surface",
      "• Ensure good lighting without glare",
      "• Keep camera steady",
      "• Avoid shadows on the document",
      "• Make sure all corners are visible"
    ];
  };

  const _takePhoto = async () => {
    if (!camera.current || !cameraReady) {
      ToastAndroid.show("Camera not ready", 4000)
      return
    }

    setIsCapturing(true)
    try {
      const file = await camera.current.takePhoto({
        flash: torchOn ? 'on' : 'off',
        // qualityPrioritization: 'quality',
      })
      
      if (file) {
        dispatch(setPhoto(file))
        navigation.navigate(screenNames.UploadFront)
      }
    } catch (error) {
      ToastAndroid.show("Failed to capture photo", 4000)
      console.error(error)
    } finally {
      setIsCapturing(false)
    }
  }

  const toggleTorch = () => {
    setTorchOn(!torchOn)
  }

  const translateY = scanAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200], // Match the height of the document frame
  });

  return (
    <SafeAreaContainer>
      <View style={styles.main}>
        
        {/* Header */}
        <View style={styles.header}>
          <CustomAppBar 
            title={uploadSide ? `${uploadSide.toUpperCase()} SIDE` : "DOCUMENT CAPTURE"}
            description={getDocumentGuidance()}
            canMoveBack={true}
          />
        </View>

         {/* <Camera
            style={StyleSheet.absoluteFill}
            ref={camera}
            device={device}
            isActive={true}
            photo={true}
            torch={torchOn ? 'on' : 'off'}
            onInitialized={() => setCameraReady(true)}
            enableZoomGesture={true}
          /> */}

        {/* Camera Preview with Guidance Overlay */}
        <View style={styles.cameraContainer}>
          <Camera
            style={{width: '100%', height: '100%'}}
            ref={camera}
            device={device}
            isActive={true}
            photo={true}
            onInitialized={() => setCameraReady(true)}
            enableZoomGesture={true}
          />
          
          {/* Overlay */}
          <View style={styles.overlay}>
            
            {/* Document Frame */}
            <View style={styles.documentFrame}>
              <View style={styles.frameBorder}>
                {/* Animated scanning line */}
                <Animated.View 
                  style={[
                    styles.scanLine,
                    { transform: [{ translateY }] }
                  ]} 
                />
                
                {/* Corner markers */}
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
              
              {/* Guidance Text */}
              <View style={styles.guidanceTextContainer}>
                <Text style={styles.guidanceText}>
                  Position {uploadSide} side here
                </Text>
              </View>
            </View>

          </View>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <Animated.View style={{ transform: [{ scale: pulseAnimation }] }}>
            <TouchableOpacity 
              style={[
                styles.captureButton,
                isCapturing && styles.captureButtonDisabled
              ]} 
              onPress={_takePhoto}
              disabled={isCapturing}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </Animated.View>
          
          {isCapturing && (
            <Text style={styles.capturingText}>Capturing...</Text>
          )}
        </View>
      </View>
    </SafeAreaContainer>
  )
}

export default CaptureDocument

const styles = StyleSheet.create({
  main: {
    width:dimentions.vw,
    height:dimentions.vh,
    backgroundColor: colors.black,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    fontSize: 16,
    color: colors.black,
    textAlign: "center",
    marginBottom: 20,
  },
  header: {
    height: 100,
    width: "100%",
    backgroundColor: colors.white,
  },
  cameraContainer: {
    width: '100%',
    height:400,
    position: 'relative',
    backgroundColor:"pink",
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentFrame: {
    width: screenWidth * 0.85,
    height: 250,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frameBorder: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  scanLine: {
    width: '100%',
    height: 2,
    backgroundColor: colors.primary, // Use your primary color
    position: 'absolute',
    left: 0,
  },
  corner: {
    width: 20,
    height: 20,
    position: 'absolute',
    borderColor: colors.white,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  guidanceTextContainer: {
    position: 'absolute',
    top: -40,
    alignItems: 'center',
  },
  guidanceText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  tipsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 8,
  },
  tipText: {
    color: colors.white,
    fontSize: 12,
    marginBottom: 4,
  },
  flashButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  flashButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  bottomControls: {
    height: 150,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.black,
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  capturingText: {
    color: colors.white,
    marginTop: 10,
    fontSize: 14,
  },
})