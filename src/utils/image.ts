import * as ImageManipulator from 'expo-image-manipulator';

export const compressImage = async (uri: string): Promise<string> => {
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 100, height: 100 } }],
      { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );

    if (!result.base64) {
      throw new Error('Failed to generate base64 image');
    }

    const base64String = `data:image/jpeg;base64,${result.base64}`;
    
    // Check size (base64 is ~4/3 of binary size)
    // 4KB limit roughly means 3000 chars of base64
    if (base64String.length > 5000) {
       // If still too large, try even more aggressive compression
       const extraResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 80, height: 80 } }],
        { compress: 0.3, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      return `data:image/jpeg;base64,${extraResult.base64}`;
    }

    return base64String;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
};
