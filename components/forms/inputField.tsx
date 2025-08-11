import React from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface InputFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  icon?: React.ReactNode;
  secureTextEntry?: boolean;
  rules?: any;
  error?: FieldError;
  keyboardType?: 'default' | 'email-address';
}

const InputField: React.FC<InputFieldProps> = ({
  control,
  name,
  label,
  placeholder,
  icon,
  secureTextEntry,
  rules,
  error,
  keyboardType = 'default',
}) => {
  return (
    <View className="mb-5">
      <Text className="text-base text-gray-900 mb-2">{label}</Text>
      <View className="flex-row items-center border-2 border-gray-200 rounded-xl px-4 h-14 bg-white">
        {icon && <View className="mr-3">{icon}</View>}
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              className="flex-1 text-base text-gray-900"
              style={styles.input}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              placeholderTextColor="#9CA3AF"
              secureTextEntry={secureTextEntry}
              autoCapitalize="none"
              keyboardType={keyboardType}
            />
          )}
        />
      </View>
      {error && (
        <Text className="text-sm text-red-500 mt-1">{error.message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: '100%',
    textAlignVertical: 'center',
  },
});

export default InputField;
