import React, { useState, useEffect } from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface CustomDatePickerProps {
  deliveryCombo: string;
  onConfirm: (date: Date) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ deliveryCombo, onConfirm }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);
  const [currentMonthDates, setCurrentMonthDates] = useState<Date[]>([]);

  const openDatePicker = () => {
    setDatePickerVisibility(true);
    generateCurrentMonthDates();
  };

  const closeDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    const selectedDay = date.getDay();
    const validDays = deliveryCombo === '2-4-6' ? [1, 3, 5] : [2, 4, 6];

    if (!validDays.includes(selectedDay)) {
      Alert.alert('Error', 'Selected delivery date does not match the delivery days. Please choose a valid date.');
      return;
    }

    closeDatePicker();
    onConfirm(date);
  };

  const generateCurrentMonthDates = () => {
    const dates: Date[] = [];
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date));
    }

    setCurrentMonthDates(dates);
  };

  const isDateDisabled = (date: Date) => {
    const validDays = deliveryCombo === '2-4-6' ? [1, 3, 5] : [2, 4, 6];
    return !validDays.includes(date.getDay());
  };

  const renderDatePicker = () => {
    return currentMonthDates.map((date, index) => (
      <Button
        key={index}
        title={date.toLocaleDateString()}
        disabled={isDateDisabled(date)}
        onPress={() => handleConfirm(date)}
      />
    ));
  };

  return (
    <View>
      <Button title="Chọn ngày giao" onPress={openDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={closeDatePicker}
      />
      {isDatePickerVisible && <View style={styles.datePickerContainer}>{renderDatePicker()}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  datePickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default CustomDatePicker;
