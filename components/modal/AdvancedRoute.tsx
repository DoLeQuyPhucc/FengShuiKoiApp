import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '@/constants/Colors';

interface AdvancedRouteModalProps {
  visible: boolean;
  onClose: () => void;
  fadeAnim: Animated.Value;
  data: {
    message?: {
      message_NumberOfFish_Error?: string;
      message_NumberOfFish_suggestion?: string;
      message_Color_Error?: string;
      message_Color_suggestion?: string;
      message_Color_suitable_hexCode?: Array<{
        hexCode: string;
        meaning: string;
      }>;
      message_Direction_suggestion?: string;
      message_Direction_suggestion_list?: {
        mainDirections?: string[];
        lifeEnergy?: string[];
        wealthEnergy?: string[];
        moneyEnergy?: string[];
        note?: string;
      };
    };
  };
}

const AdvancedRouteModal: React.FC<AdvancedRouteModalProps> = ({
  visible,
  onClose,
  fadeAnim,
  data,
}) => {
  // Early return if data or message is not available
  if (!data?.message) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kết Quả Kiểm Tra Phong Thủy</Text>
              <TouchableOpacity onPress={onClose}>
                <MaterialIcons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={48} color="#FF4444" />
              <Text style={styles.errorText}>Không có dữ liệu phân tích</Text>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  }

  const { message } = data;

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
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kết Quả Kiểm Tra Phong Thủy</Text>
              <TouchableOpacity onPress={onClose}>
                <MaterialIcons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.resultContainer}>
              {/* Số lượng cá */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons name="fish" size={24} color={Colors.darkBlueText} />
                  <Text style={styles.sectionTitle}>Số lượng cá</Text>
                </View>
                {message.message_NumberOfFish_Error && (
                  <View style={styles.errorMessage}>
                    <MaterialIcons name="error" size={20} color="#FF4444" />
                    <Text style={styles.errorText}>{message.message_NumberOfFish_Error}</Text>
                  </View>
                )}
                {message.message_NumberOfFish_suggestion && (
                  <View style={styles.suggestionMessage}>
                    <MaterialIcons name="lightbulb" size={20} color="#4CAF50" />
                    <Text style={styles.suggestionText}>{message.message_NumberOfFish_suggestion}</Text>
                  </View>
                )}
              </View>

              {/* Màu sắc */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons name="color-lens" size={24} color={Colors.darkBlueText} />
                  <Text style={styles.sectionTitle}>Màu sắc</Text>
                </View>
                {message.message_Color_Error && (
                  <View style={styles.errorMessage}>
                    <MaterialIcons name="error" size={20} color="#FF4444" />
                    <Text style={styles.errorText}>{message.message_Color_Error}</Text>
                  </View>
                )}
                {message.message_Color_suggestion && (
                  <View style={styles.suggestionMessage}>
                    <MaterialIcons name="lightbulb" size={20} color="#4CAF50" />
                    <Text style={styles.suggestionText}>{message.message_Color_suggestion}</Text>
                  </View>
                )}
                <View style={styles.colorList}>
                  {message.message_Color_suitable_hexCode?.map((color, index) => (
                    <View key={index} style={styles.colorItem}>
                      <View style={[styles.colorCircle, { backgroundColor: color.hexCode }]} />
                      <Text style={styles.colorMeaning}>{color.meaning}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Hướng */}
              {(message.message_Direction_suggestion || message.message_Direction_suggestion_list) && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons name="compass" size={24} color={Colors.darkBlueText} />
                    <Text style={styles.sectionTitle}>Hướng</Text>
                  </View>
                  {message.message_Direction_suggestion && (
                    <View style={styles.successMessage}>
                      <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
                      <Text style={styles.successText}>{message.message_Direction_suggestion}</Text>
                    </View>
                  )}
                  
                  {message.message_Direction_suggestion_list && (
                    <View style={styles.directionDetails}>
                      {message.message_Direction_suggestion_list.mainDirections && (
                        <>
                          <Text style={styles.directionLabel}>Hướng chính phù hợp:</Text>
                          <Text style={styles.directionText}>
                            {message.message_Direction_suggestion_list.mainDirections.join(', ')}
                          </Text>
                        </>
                      )}

                      {message.message_Direction_suggestion_list.lifeEnergy && (
                        <>
                          <Text style={styles.directionLabel}>Hướng sinh khí:</Text>
                          <Text style={styles.directionText}>
                            {message.message_Direction_suggestion_list.lifeEnergy.join(', ')}
                          </Text>
                        </>
                      )}

                      {message.message_Direction_suggestion_list.wealthEnergy && (
                        <>
                          <Text style={styles.directionLabel}>Hướng tài lộc:</Text>
                          <Text style={styles.directionText}>
                            {message.message_Direction_suggestion_list.wealthEnergy.join(', ')}
                          </Text>
                        </>
                      )}

                      {message.message_Direction_suggestion_list.moneyEnergy && (
                        <>
                          <Text style={styles.directionLabel}>Hướng tiền tài:</Text>
                          <Text style={styles.directionText}>
                            {message.message_Direction_suggestion_list.moneyEnergy.join(', ')}
                          </Text>
                        </>
                      )}
                    </View>
                  )}

                  {message.message_Direction_suggestion_list?.note && (
                    <View style={styles.noteMessage}>
                      <MaterialIcons name="info" size={20} color="#2196F3" />
                      <Text style={styles.noteText}>
                        {message.message_Direction_suggestion_list.note}
                      </Text>
                    </View>
                  )}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  resultContainer: {
    flex: 1,
    padding: 15,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: Colors.darkBlueText,
  },
  errorMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorText: {
    color: '#FF4444',
    marginLeft: 10,
    flex: 1,
  },
  suggestionMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  suggestionText: {
    color: '#4CAF50',
    marginLeft: 10,
    flex: 1,
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  successText: {
    color: '#4CAF50',
    marginLeft: 10,
    flex: 1,
  },
  colorList: {
    marginTop: 10,
  },
  colorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  colorMeaning: {
    flex: 1,
    fontSize: 14,
    color: Colors.darkBlueText,
  },
  directionDetails: {
    marginTop: 10,
  },
  directionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.darkBlueText,
    marginTop: 8,
  },
  directionText: {
    fontSize: 14,
    color: Colors.darkBlueText,
    marginBottom: 5,
  },
  noteMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  noteText: {
    color: '#2196F3',
    marginLeft: 10,
    flex: 1,
  },
});

export default AdvancedRouteModal;