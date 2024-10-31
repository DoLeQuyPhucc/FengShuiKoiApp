import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  Animated,
} from 'react-native';
import {
  Text,
  Provider as PaperProvider,
  Surface,
  TextInput,
  Button,
  Dialog,
  Portal,
  RadioButton,
  List,
  Chip,
  useTheme,
} from 'react-native-paper';
import { TabView, TabBar } from 'react-native-tab-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '@/constants/Colors';
import axiosInstance from '@/api/axiosInstance';
import BasicRouteModal from '@/components/modal/BasicRoute';
import AdvancedRouteModal from '@/components/modal/AdvancedRoute';
interface KoiFish {
  id: string;
  color: string;
  displayName: string;
}

const directions = [
  'Đông',
  'Tây',
  'Nam',
  'Bắc',
  'Tây Nam',
  'Đông Nam',
  'Tây Bắc',
  'Đông Bắc',
];

const koiColors = [
  { displayName: 'Xanh lá', hexCode: '#008000' },
  { displayName: 'Red', hexCode: '#FF0000' },
  { displayName: 'Hồng', hexCode: '#FF69B4' },
  { displayName: 'Cam', hexCode: '#FFA500' },
  { displayName: 'Trắng', hexCode: '#FFFFFF' },
  { displayName: 'Đen', hexCode: '#000000' },
  { displayName: 'Xanh dương', hexCode: '#0000FF' },
  { displayName: 'Vàng', hexCode: '#FFFF00' },
  { displayName: 'Xám', hexCode: '#D3D3D3' },
  { displayName: 'Vàng cam', hexCode: '#FFD700' },
  { displayName: 'Tím', hexCode: '#800080' },
];

const HomeScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'basic', title: 'Basic' },
    { key: 'advanced', title: 'Advanced' },
  ]);

  // Shared state between tabs
  const [date, setDate] = useState(new Date());
  const [sex, setSex] = useState<'male' | 'female' | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBasicRouteModal, setShowBasicRouteModal] = useState(false);
  const [showAdvancedRouteRouteModal, setShowAdvancedRouteRouteModal] = useState(false);
  const [data, setData] = useState<any>(null);

  // Advanced tab state
  const [koiFishes, setKoiFishes] = useState<KoiFish[]>([]);
  const [selectedDirection, setSelectedDirection] = useState<string>('');
  const [showDirectionDialog, setShowDirectionDialog] = useState(false);
  const [showColorDialog, setShowColorDialog] = useState(false);
  const [numberOfFish, setNumberOfFish] = useState<string>('');
  const [showNumberDialog, setShowNumberDialog] = useState(false);

  const handleDateChange = (selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleSexChange = (selectedSex: 'male' | 'female') => {
    setSex(selectedSex);
  };

  const addKoiFish = (colorHex: string) => {
    const colorInfo = koiColors.find(c => c.hexCode === colorHex);
    if (colorInfo) {
      setKoiFishes([
        ...koiFishes,
        {
          id: Math.random().toString(),
          color: colorInfo.displayName,
          displayName: colorInfo.displayName
        }
      ]);
    }
    setShowColorDialog(false);
  };

  const removeKoiFish = (id: string) => {
    setKoiFishes(koiFishes.filter(fish => fish.id !== id));
  };

  const validateBasicInfo = () => {
    const year = date.getFullYear();
    if (year <= 1900) {
      Alert.alert('Invalid Date', 'Please enter a valid date.');
      return false;
    }

    if (!sex) {
      Alert.alert('Select Sex', 'Please select your sex.');
      return false;
    }

    return true;
  };

  const validateAdvancedInfo = () => {
    if (!validateBasicInfo()) return false;
    
    if (!selectedDirection) {
      Alert.alert('Select Direction', 'Please select a pond direction.');
      return false;
    }

    if (!numberOfFish || parseInt(numberOfFish) <= 0) {
      Alert.alert('Invalid Number', 'Please enter a valid number of fish.');
      return false;
    }

    if (koiFishes.length === 0) {
      Alert.alert('No Koi Fish', 'Please add at least one koi fish.');
      return false;
    }

    return true;
  };

  const handleResult = async (isAdvanced: boolean = false) => {
    const isValid = isAdvanced ? validateAdvancedInfo() : validateBasicInfo();
    
    if (isValid) {
      try {
        const formattedDate = date.toISOString().split('T')[0];
        
        if (isAdvanced) {
          const response = await axiosInstance.post('/consultation/recommend', {
            date: formattedDate,
            sex,
            numberOfFish: parseInt(numberOfFish),
            listColors: koiFishes.map(fish => fish.color),
            direction: selectedDirection
          });
          setData(response.data);
          setShowAdvancedRouteRouteModal(true);
        } else {
          const response = await axiosInstance.get(`/consultation/${formattedDate}&${sex}`);
          setData(response.data);
          setShowBasicRouteModal(true);
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to fetch data. Please try again later.');
      }
    }
  };

  const renderBasicTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Enter your date of birth</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>{date.toDateString()}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Select your sex</Text>
        <View style={styles.sexButtonsContainer}>
          <TouchableOpacity
            style={[styles.sexButton, sex === 'male' ? styles.selectedSexButton : null]}
            onPress={() => handleSexChange('male')}
          >
            <MaterialIcons name="male" size={24} color={sex === 'male' ? Colors.darkBlue : Colors.darkBlueText} />
            <Text style={[styles.sexButtonText, sex === 'male' ? styles.selectedSexButtonText : null]}>
              Male
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sexButton, sex === 'female' ? styles.selectedSexButton : null]}
            onPress={() => handleSexChange('female')}
          >
            <MaterialIcons name="female" size={24} color={sex === 'female' ? Colors.pink : Colors.darkBlueText} />
            <Text style={[styles.sexButtonText, sex === 'female' ? styles.selectedSexButtonText : null]}>
              Female
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          mode="contained"
          style={styles.resultButton}
          onPress={() => handleResult(false)}
        >
          Get Basic Result
        </Button>
      </View>
    </ScrollView>
  );

  const renderAdvancedTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      <Surface style={styles.formContainer}>
        <Text style={styles.label}>Enter your date of birth</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>{date.toDateString()}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Select your sex</Text>
        <View style={styles.sexButtonsContainer}>
          <TouchableOpacity
            style={[styles.sexButton, sex === 'male' ? styles.selectedSexButton : null]}
            onPress={() => handleSexChange('male')}
          >
            <MaterialIcons name="male" size={24} color={sex === 'male' ? Colors.darkBlue : Colors.darkBlueText} />
            <Text style={[styles.sexButtonText, sex === 'male' ? styles.selectedSexButtonText : null]}>
              Male
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sexButton, sex === 'female' ? styles.selectedSexButton : null]}
            onPress={() => handleSexChange('female')}
          >
            <MaterialIcons name="female" size={24} color={sex === 'female' ? Colors.pink : Colors.darkBlueText} />
            <Text style={[styles.sexButtonText, sex === 'female' ? styles.selectedSexButtonText : null]}>
              Female
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Number of Fish</Text>
        <Button
          mode="outlined"
          onPress={() => setShowNumberDialog(true)}
          style={styles.directionButton}
        >
          {numberOfFish ? `${numberOfFish} Fish` : 'Select Number of Fish'}
        </Button>

        <Text style={styles.label}>Pond Direction</Text>
        <Button
          mode="outlined"
          onPress={() => setShowDirectionDialog(true)}
          style={styles.directionButton}
        >
          {selectedDirection || 'Select Direction'}
        </Button>

        <Text style={styles.label}>Koi Fish Configuration</Text>
        <View style={styles.koiContainer}>
          {koiFishes.map((fish) => (
            <Chip
              key={fish.id}
              onClose={() => removeKoiFish(fish.id)}
              style={styles.koiChip}
            >
              {fish.color}
            </Chip>
          ))}
          <Button
            mode="outlined"
            onPress={() => setShowColorDialog(true)}
            style={styles.addKoiButton}
          >
            Add Koi Fish Color
          </Button>
        </View>

        <Button
          mode="contained"
          style={styles.resultButton}
          onPress={() => handleResult(true)}
        >
          Get Advanced Result
        </Button>
      </Surface>

      <Portal>
        <Dialog visible={showDirectionDialog} onDismiss={() => setShowDirectionDialog(false)}>
          <Dialog.Title>Select Pond Direction</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group onValueChange={value => {
              setSelectedDirection(value);
              setShowDirectionDialog(false);
            }} value={selectedDirection}>
              {directions.map((direction) => (
                <RadioButton.Item key={direction} label={direction} value={direction} />
              ))}
            </RadioButton.Group>
          </Dialog.Content>
        </Dialog>

        <Dialog visible={showNumberDialog} onDismiss={() => setShowNumberDialog(false)}>
          <Dialog.Title>Enter Number of Fish</Dialog.Title>
          <Dialog.Content>
            <TextInput
              keyboardType="numeric"
              value={numberOfFish}
              onChangeText={(text) => {
                // Only allow positive numbers
                if (/^\d*$/.test(text)) {
                  setNumberOfFish(text);
                }
              }}
              style={styles.numberInput}
              mode='outlined'
              placeholder="Enter number of fish"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowNumberDialog(false)}>Done</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={showColorDialog} onDismiss={() => setShowColorDialog(false)}>
          <Dialog.Title>Select Koi Color</Dialog.Title>
          <Dialog.Content>
          <RadioButton.Group onValueChange={value => addKoiFish(value)} value="">
            {koiColors.map((color) => (
              <View 
                key={color.hexCode}
                style={{
                  backgroundColor: 'transparent',
                  marginVertical: 4,
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <View 
                  style={{
                    backgroundColor: color.hexCode, 
                    padding: 10, 
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                    marginRight: 10
                  }}
                >
                  <Text 
                    style={{
                      color: isColorDark(color.hexCode) ? '#FFFFFF' : '#000000',
                      marginLeft: 10,
                      flex: 1
                    }}
                  >
                    {color.displayName}
                  </Text>
                </View>
                <RadioButton 
                  value={color.hexCode} 
                  color={isColorDark(color.hexCode) ? '#FFFFFF' : '#000000'}
                />
              </View>
            ))}
          </RadioButton.Group>
        </Dialog.Content>
        </Dialog>
      </Portal>
    </ScrollView>
  );

  const isColorDark = (hexColor: string): boolean => {
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    // Standard formula for luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5; // Return true if dark
  };
  

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'basic':
        return renderBasicTab();
      case 'advanced':
        return renderAdvancedTab();
      default:
        return null;
    }
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.safeArea}>
        <ImageBackground
          source={require('../assets/images/fishkoi.webp')}
          style={styles.background}
          imageStyle={styles.backgroundImage}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>FengShuiKoi</Text>
          </View>

          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={props => (
              <TabBar
                {...props}
                style={styles.tabBar}
                labelStyle={styles.tabLabel}
                indicatorStyle={styles.tabIndicator}
              />
            )}
          />

          <DateTimePickerModal
            isVisible={showDatePicker}
            mode="date"
            onConfirm={handleDateChange}
            onCancel={() => setShowDatePicker(false)}
          />

          <BasicRouteModal
            visible={showBasicRouteModal}
            onClose={() => setShowBasicRouteModal(false)}
            fadeAnim={new Animated.Value(1)}
            data={data}
          />

          <AdvancedRouteModal
            visible={showAdvancedRouteRouteModal}
            onClose={() => setShowAdvancedRouteRouteModal(false)}
            fadeAnim={new Animated.Value(1)}
            data={data}
          />
        </ImageBackground>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  backgroundImage: {
    resizeMode: 'cover',
  },
  titleContainer: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.lightGreen,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  tabBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    elevation: 0,
    shadowOpacity: 0,
  },
  tabLabel: {
    color: Colors.darkBlueText,
    fontWeight: 'bold',
  },
  tabIndicator: {
    backgroundColor: Colors.lightGreen,
  },
  tabContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  formContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    color: Colors.darkBlueText,
    fontWeight: 'bold',
  },
  dateButton: {
    backgroundColor: Colors.lightGreen,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  sexButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  sexButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  selectedSexButton: {
    backgroundColor: Colors.lightGreen,
  },
  sexButtonText: {
    color: Colors.darkBlueText,
    fontSize: 16,
    marginLeft: 8,
  },
  selectedSexButtonText: {
    color: '#FFFFFF',
  },
  directionButton: {
    marginBottom: 20,
  },
  koiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  koiChip: {
    margin: 4,
  },
  addKoiButton: {
    marginTop: 8,
  },
  resultButton: {
    marginTop: 20,
    backgroundColor: Colors.lightGreen,
  },
  numberInput: {
    backgroundColor: 'transparent',
    marginTop: 8,
  },
});

export default HomeScreen;