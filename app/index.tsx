import "../global.css"
import {
  CameraView,
  useCameraPermissions,
  CameraType,
  BarcodeScanningResult
} from "expo-camera"
import { useEffect, useRef, useState } from "react"
import { View, Text, TouchableOpacity, Alert } from "react-native"
import Test from "./test"

const App = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions()
  const [facing, setFacing] = useState<CameraType>("back")
  const [data, setData] = useState("")
  const cameraRef = useRef<CameraView>(null)

  useEffect(() => {
    if (!cameraPermission?.granted) {
      requestCameraPermission()
    }
  }, [cameraPermission])

  const handleFlip = () => {
    setFacing(facing === "back" ? "front" : "back")
  }

  const handleBarcodeScanned = (result: BarcodeScanningResult) => {
    if (!data) {
      Alert.alert(result.data)
      setData(result.data)
    }
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      const result = await cameraRef.current.takePictureAsync()
    }
  }

  return (
    <View className="flex-1">
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"]
        }}
        onBarcodeScanned={handleBarcodeScanned}
      />
      <View className="absolute bottom-20 w-full flex-row items-center justify-around">
        <TouchableOpacity
          onPress={takePhoto}
          className="bg-white w-16 h-16 rounded-full border-4 border-gray-300"
        ></TouchableOpacity>
        <TouchableOpacity
          onPress={handleFlip}
          className="bg-blue-700 p-3 rounded-xl"
        >
          <Text className="text-white font-bold">Flip</Text>
        </TouchableOpacity>
      </View>
      {/* <Test /> */}
    </View>
  )
}

export default App
