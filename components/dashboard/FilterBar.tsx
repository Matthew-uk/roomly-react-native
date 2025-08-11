import React, { useState } from 'react';
import { Text, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export default function FilterBar() {
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ marginBottom: 10 }}>Select an option:</Text>
      <RNPickerSelect
        onValueChange={(value) => setSelectedValue(value)}
        items={[
          { label: 'Apple', value: 'apple' },
          { label: 'Banana', value: 'banana' },
          { label: 'Orange', value: 'orange' },
        ]}
        placeholder={{ label: 'Select a fruit...', value: null }}
      />
      {selectedValue ? <Text>You selected: {selectedValue}</Text> : null}
    </View>
  );
}
