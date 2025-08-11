import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SocialButtonProps {
  provider: 'apple' | 'facebook' | 'google';
  onPress: () => void;
  disabled?: boolean;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  onPress,
  disabled = false,
}) => {
  const getProviderConfig = () => {
    switch (provider) {
      case 'apple':
        return {
          title: 'Continue with Apple',
          icon: 'apple',
          borderColor: 'border-gray-300',
          textColor: 'text-gray-700',
        };
      case 'facebook':
        return {
          title: 'Continue with Facebook',
          icon: 'facebook',
          borderColor: 'border-blue-500',
          textColor: 'text-blue-600',
        };
      case 'google':
        return {
          title: 'Continue with Google',
          icon: 'google',
          borderColor: 'border-red-500',
          textColor: 'text-red-600',
        };
      default:
        return {
          title: 'Continue',
          icon: 'login',
          borderColor: 'border-gray-300',
          textColor: 'text-gray-700',
        };
    }
  };

  const config = getProviderConfig();

  return (
    <TouchableOpacity
      className={`
        w-full py-4 px-6 rounded-xl border-2 ${config.borderColor}
        flex-row items-center justify-center mb-3
        ${disabled ? 'opacity-50' : ''}
      `}
      onPress={onPress}
      disabled={disabled}
    >
      <View className="flex-row items-center">
        <Icon
          name={config.icon}
          size={20}
          color={
            config.textColor.includes('blue')
              ? '#2563eb'
              : config.textColor.includes('red')
              ? '#dc2626'
              : '#374151'
          }
        />
        <Text className={`ml-3 font-semibold text-base ${config.textColor}`}>
          {config.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default SocialButton;
