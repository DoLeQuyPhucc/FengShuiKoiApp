import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Surface, Button, Dialog, RadioButton, Portal, Chip } from 'react-native-paper';
import { TabView, TabBar } from 'react-native-tab-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '@/constants/Colors';

interface KoiFish {
  id: string;
  color: string;
}

interface CustomTabViewProps {
  index: number;
  setIndex: (index: number) => void;
  date: Date;
  sex: 'male' | 'female' | null;
  setShowDatePicker: (show: boolean) => void;
  handleSexChange: (sex: 'male' | 'female') => void;
  handleResult: (isAdvanced: boolean) => void;
  // Advanced tab props
  selectedDirection: string;
  setShowDirectionDialog: (show: boolean) => void;
  showDirectionDialog: boolean;
  setSelectedDirection: (direction: string) => void;
  koiFishes: KoiFish[];
  setShowColorDialog: (show: boolean) => void;
  showColorDialog: boolean;
  addKoiFish: (color: string) => void;
  removeKoiFish: (id: string) => void;
}

const directions = [
  'North',
  'Northeast',
  'East',
  'Southeast',
  'South',
  'Southwest',
  'West',
  'Northwest',
];

const koiColors = [
  'White',
  'Black',
  'Red',
  'Yellow',
  'Blue',
  'Orange',
  'Gold',
  'Silver',
];

const CustomTabView: React.FC<CustomTabViewProps> = ({
  index,
  setIndex,
  date,
  sex,
  setShowDatePicker,
  handleSexChange,
  handleResult,
  selectedDirection,
  setShowDirectionDialog,
  showDirectionDialog,
  setSelectedDirection,
  koiFishes,
  setShowColorDialog,
  showColorDialog,
  addKoiFish,
  removeKoiFish,
}) => {
  const [routes] = React.useState([
    { key: 'basic', title: 'Basic' },
    { key: 'advanced', title: 'Advanced' },
  ]);

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
              {fish.color} Koi
            </Chip>
          ))}
          <Button
            mode="outlined"
            onPress={() => setShowColorDialog(true)}
            style={styles.addKoiButton}
          >
            Add Koi Fish
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

        <Dialog visible={showColorDialog} onDismiss={() => setShowColorDialog(false)}>
          <Dialog.Title>Select Koi Color</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group onValueChange={value => addKoiFish(value)} value="">
              {koiColors.map((color) => (
                <RadioButton.Item key={color} label={color} value={color} />
              ))}
            </RadioButton.Group>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </ScrollView>
  );

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
  );
};

const styles = StyleSheet.create({
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
});

export default CustomTabView;