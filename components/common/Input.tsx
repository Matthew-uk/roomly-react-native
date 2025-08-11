import React, { forwardRef } from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: FieldError;
  control?: Control<any>;
  name?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerClassName?: string;
}

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      control,
      name,
      leftIcon,
      rightIcon,
      onRightIconPress,
      containerClassName = '',
      className = '',
      ...props
    },
    ref,
  ) => {
    const inputContent = (
      <View className={`mb-4 ${containerClassName}`}>
        {label && (
          <Text className="text-gray-700 text-base font-medium mb-2">
            {label}
          </Text>
        )}
        <View className="relative">
          <TextInput
            ref={ref}
            className={`
              border border-gray-200 rounded-xl px-4 py-4 text-base
              ${leftIcon ? 'pl-12' : ''}
              ${rightIcon ? 'pr-12' : ''}
              ${error ? 'border-red-500' : 'border-gray-200'}
              ${className}
            `}
            placeholderTextColor="#9ca3af"
            {...props}
          />
          {leftIcon && (
            <Icon
              name={leftIcon}
              size={20}
              color="#6b7280"
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
            />
          )}
          {rightIcon && (
            <TouchableOpacity
              onPress={onRightIconPress}
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
            >
              <Icon name={rightIcon} size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
        {error && (
          <Text className="text-red-500 text-sm mt-1">{error.message}</Text>
        )}
      </View>
    );

    if (control && name) {
      return (
        <Controller
          control={control}
          name={name}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <View className={`mb-4 ${containerClassName}`}>
              {label && (
                <Text className="text-gray-700 text-base font-medium mb-2">
                  {label}
                </Text>
              )}
              <View className="relative">
                <TextInput
                  ref={ref}
                  className={`
                    border border-gray-200 rounded-xl px-4 py-4 text-base
                    ${leftIcon ? 'pl-12' : ''}
                    ${rightIcon ? 'pr-12' : ''}
                    ${error ? 'border-red-500' : 'border-gray-200'}
                    ${className}
                  `}
                  placeholderTextColor="#9ca3af"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  {...props}
                />
                {leftIcon && (
                  <Icon
                    name={leftIcon}
                    size={20}
                    color="#6b7280"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  />
                )}
                {rightIcon && (
                  <TouchableOpacity
                    onPress={onRightIconPress}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <Icon name={rightIcon} size={20} color="#6b7280" />
                  </TouchableOpacity>
                )}
              </View>
              {error && (
                <Text className="text-red-500 text-sm mt-1">
                  {error.message}
                </Text>
              )}
            </View>
          )}
        />
      );
    }

    return inputContent;
  },
);

Input.displayName = 'Input';

export default Input;
