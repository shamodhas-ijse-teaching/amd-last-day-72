import "../global.css"
import {
  CameraView,
  useCameraPermissions,
  CameraType,
  BarcodeScanningResult
} from "expo-camera"
import { useEffect, useRef, useState } from "react"
import { View, Text, TouchableOpacity, Alert, Image } from "react-native"
import * as MediaLibrary from "expo-media-library"

const App = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions()

  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions()

  const cameraRef = useRef<CameraView>(null)
  const [facing, setFacing] = useState<CameraType>("back")
  const [data, setData] = useState("")
  const [photo, setPhoto] = useState("")

  useEffect(() => {
    ;(async () => {
      if (!cameraPermission?.granted) {
        await requestCameraPermission()
      }
      if (!mediaPermission?.granted) {
        await requestMediaPermission()
      }
    })()
  }, [cameraPermission, mediaPermission])

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
      setPhoto(result.uri)

      const asset = await MediaLibrary.createAssetAsync(result.uri)
      await MediaLibrary.createAlbumAsync("amd-71", asset, false)
    }
  }

  if (!cameraPermission?.granted || !mediaPermission?.granted) {
    return <View></View>
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
      {photo && (
        <View className="absolute top-16 right-5 shadow-lg shadow-black/50">
          <Image
            source={{ uri: photo }}
            className="w-24 rounded-xl border-2 border-white"
            style={{ aspectRatio: 3 / 4 }}
            resizeMode="cover"
          />
        </View>
      )}
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
    </View>
  )
}

export default App
