import * as ImageManipulator from 'expo-image-manipulator';
import { compressImage } from '../image';

jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn(),
  SaveFormat: {
    JPEG: 'jpeg',
  },
}));

describe('compressImage', () => {
  const mockUri = 'file://path/to/image.jpg';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('compresses image successfully', async () => {
    (ImageManipulator.manipulateAsync as jest.Mock).mockResolvedValue({
      base64: 'mockBase64Data',
    });

    const result = await compressImage(mockUri);

    expect(ImageManipulator.manipulateAsync).toHaveBeenCalledWith(
      mockUri,
      [{ resize: { width: 100, height: 100 } }],
      expect.objectContaining({ compress: 0.5, base64: true })
    );
    expect(result).toBe('data:image/jpeg;base64,mockBase64Data');
  });

  it('throws error if base64 generation fails', async () => {
    (ImageManipulator.manipulateAsync as jest.Mock).mockResolvedValue({
      base64: null,
    });

    await expect(compressImage(mockUri)).rejects.toThrow('Failed to generate base64 image');
  });

  it('applies aggressive compression if initial result is too large', async () => {
    // First call returns large string
    (ImageManipulator.manipulateAsync as jest.Mock)
      .mockResolvedValueOnce({
        base64: 'a'.repeat(6000),
      })
      // Second call returns smaller string
      .mockResolvedValueOnce({
        base64: 'smallBase64',
      });

    const result = await compressImage(mockUri);

    expect(ImageManipulator.manipulateAsync).toHaveBeenCalledTimes(2);
    expect(ImageManipulator.manipulateAsync).toHaveBeenLastCalledWith(
      mockUri,
      [{ resize: { width: 80, height: 80 } }],
      expect.objectContaining({ compress: 0.3, base64: true })
    );
    expect(result).toBe('data:image/jpeg;base64,smallBase64');
  });
});
