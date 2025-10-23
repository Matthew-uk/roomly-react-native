import React from 'react';
import { Controller } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';

// Define the FormFieldProps interface
interface FormFieldProps {
  label: string;
  name: string;
  icon?: React.ReactNode;
  placeholder?: string;
  control: any; // Replace 'any' with the appropriate type from react-hook-form if available
  rules?: object; // Replace 'object' with the appropriate type if available
  error?: any | { message: string };
  secureTextEntry?: boolean;
  keyboardType?:
    | 'default'
    | 'number-pad'
    | 'decimal-pad'
    | 'numeric'
    | 'email-address'
    | 'phone-pad'
    | 'url';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
  rightIcon?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  icon,
  placeholder,
  control,
  rules,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  rightIcon = null as React.ReactNode,
}) => {
  return (
    <View className="mb-5">
      <Text className="text-base font-regular text-gray-900 mb-2">{label}</Text>
      <View className="flex-row items-center border-2 border-gray-200 rounded-xl px-4 py-2 bg-white relative">
        {icon}
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="flex-1 font-regular text-base text-gray-900 mb-2 h-8 px-2 bg-white tracking-wide"
              placeholder={placeholder}
              placeholderTextColor="#9CA3AF"
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {rightIcon}
      </View>
      {error && (
        <Text className="text-red-500 text-sm mt-1 font-regular">
          {error.message}
        </Text>
      )}
    </View>
  );
};
