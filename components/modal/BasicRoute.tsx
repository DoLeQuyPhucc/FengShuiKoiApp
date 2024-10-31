import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Colors from '@/constants/Colors';

// Helper function để lấy icon theo mệnh
const getMenhIcon = (menh: string | undefined) => {
  switch (menh?.toLowerCase()) {
    case 'mộc':
      return <MaterialCommunityIcons name="tree" size={40} color={Colors.lightGreen} />;
    case 'thủy':
      return <MaterialCommunityIcons name="water" size={40} color="#1E90FF" />;
    case 'hỏa':
      return <MaterialCommunityIcons name="fire" size={40} color="#FF4500" />;
    case 'thổ':
      return <MaterialCommunityIcons name="mountain" size={40} color="#8B4513" />;
    case 'kim':
      return <MaterialCommunityIcons name="gold" size={40} color="#FFD700" />;
    default:
      return <MaterialCommunityIcons name="zodiac-chinese" size={40} color={Colors.lightGreen} />;
  }
};

// Helper function để lấy màu theo mệnh
const getMenhColor = (menh: string | undefined) => {
  switch (menh?.toLowerCase()) {
    case 'mộc':
      return Colors.lightGreen;
    case 'thủy':
      return '#1E90FF';
    case 'hỏa':
      return '#FF4500';
    case 'thổ':
      return '#8B4513';
    case 'kim':
      return '#FFD700';
    default:
      return Colors.lightGreen;
  }
};

interface BasicRouteModalProps {
  visible: boolean;
  onClose: () => void;
  fadeAnim: Animated.Value;
  data: {
    name?: string;
    menh?: string;
    pondDirections?: {
      mainDirections?: string[];
      lifeEnergy?: string[];
      wealthEnergy?: string[];
      moneyEnergy?: string[];
      note?: string;
    };
    suitableColors?: {
      primary?: Array<{
        color: string;
        hexCode: string;
        meaning: string;
      }>;
    };
    luckyNumbers?: number[];
    limitations?: {
      reason?: string;
      quantity?: string;
      colors?: string[];
      directions?: string[];
    };
  } | null;
}

const BasicRouteModal: React.FC<BasicRouteModalProps> = ({
  visible,
  onClose,
  fadeAnim,
  data,
}) => {
  const menhColor = getMenhColor(data?.menh);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            <View style={[styles.modalHeader, { backgroundColor: menhColor }]}>
              <Text style={styles.modalTitle}>Kết Quả Phong Thủy - Cung Phi: {data?.name}</Text>
              <TouchableOpacity onPress={onClose}>
                <MaterialIcons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.resultContainer}>
              {/* Mệnh */}
              <View style={styles.resultElement}>
                <View style={styles.iconContainer}>
                  {getMenhIcon(data?.menh)}
                </View>
                <Text style={styles.resultText}>
                  <Text style={styles.resultLabel}>Mệnh:</Text>{' '}
                  {data?.menh}
                </Text>
              </View>

              {/* Hướng hồ chính */}
              <View style={styles.resultElement}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons name="compass" size={40} color={menhColor} />
                </View>
                <View style={styles.columnContent}>
                  <Text style={styles.resultLabel}>Hướng hồ chính:</Text>
                  <Text style={styles.resultText}>{data?.pondDirections?.mainDirections?.join(', ')}</Text>
                </View>
              </View>

              {/* Các hướng năng lượng */}
              <View style={styles.resultElement}>
                <View style={styles.iconContainer}>
                  <MaterialIcons name="energy-savings-leaf" size={40} color={menhColor} />
                </View>
                <View style={styles.columnContent}>
                  <Text style={styles.resultLabel}>Hướng năng lượng:</Text>
                  <Text style={styles.resultText}>
                    - Sinh khí: {data?.pondDirections?.lifeEnergy?.join(', ')}{'\n'}
                    - Tài lộc: {data?.pondDirections?.wealthEnergy?.join(', ')}{'\n'}
                    - Tiền tài: {data?.pondDirections?.moneyEnergy?.join(', ')}
                  </Text>
                </View>
              </View>

              {/* Màu sắc phù hợp */}
              <View style={styles.resultElement}>
                <View style={styles.iconContainer}>
                  <MaterialIcons name="color-lens" size={40} color={menhColor} />
                </View>
                <View style={styles.columnContent}>
                  <Text style={styles.resultLabel}>Màu sắc phù hợp:</Text>
                  <View style={styles.colorsContainer}>
                    {data?.suitableColors?.primary?.map((colorInfo, index) => (
                      <View key={index} style={styles.colorInfo}>
                        <View style={[styles.colorCircle, { backgroundColor: colorInfo.hexCode }]} />
                        <Text style={styles.colorText}>
                          {colorInfo.color} - {colorInfo.meaning}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {/* Con số may mắn */}
              <View style={styles.resultElement}>
                <View style={styles.iconContainer}>
                  <MaterialIcons name="filter-9-plus" size={40} color={menhColor} />
                </View>
                <View style={styles.columnContent}>
                  <Text style={styles.resultLabel}>Con số may mắn:</Text>
                  <Text style={styles.resultText}>{data?.luckyNumbers?.join(', ')}</Text>
                </View>
              </View>

              {/* Các hạn chế */}
              <View style={styles.resultElement}>
                <View style={styles.iconContainer}>
                  <MaterialIcons name="warning" size={40} color={menhColor} />
                </View>
                <View style={styles.columnContent}>
                  <Text style={styles.resultLabel}>Hạn chế:</Text>
                  <Text style={styles.resultText}>
                    - {data?.limitations?.quantity}{'\n'}
                    - Hướng không phù hợp: {data?.limitations?.directions?.join(', ')}{'\n'}
                    - Màu không phù hợp: {data?.limitations?.colors?.map(color => (
                      <View key={color} style={[styles.colorCircle, { backgroundColor: color }]} />
                    ))}
                  </Text>
                </View>
              </View>

              {/* Lý do */}
              <View style={styles.resultElement}>
                <View style={styles.iconContainer}>
                  <MaterialIcons name="info" size={40} color={menhColor} />
                </View>
                <View style={styles.columnContent}>
                  <Text style={styles.resultLabel}>Lý do:</Text>
                  <Text style={styles.resultText}>{data?.limitations?.reason}</Text>
                </View>
              </View>

              {/* Ghi chú */}
              {data?.pondDirections?.note && (
                <View style={styles.resultElement}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons name="note" size={40} color={menhColor} />
                  </View>
                  <View style={styles.columnContent}>
                    <Text style={styles.resultLabel}>Ghi chú:</Text>
                    <Text style={styles.resultText}>{data?.pondDirections?.note}</Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalScrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  resultContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  resultElement: {
    flexDirection: 'row',
    marginVertical: 12,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnContent: {
    flex: 1,
  },
  resultText: {
    fontSize: 16,
    color: Colors.darkBlueText,
    lineHeight: 24,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.darkBlueText,
    marginBottom: 5,
  },
  colorsContainer: {
    flexDirection: 'column',
    marginTop: 5,
  },
  colorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  colorText: {
    fontSize: 14,
    color: Colors.darkBlueText,
  },
});

export default BasicRouteModal;