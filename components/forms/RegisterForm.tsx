import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';
import { RegisterFormData } from '../../types/auth';
import Button from './../common/Button';
import Input from './../common/Input';
import SocialButton from './../common/SocialButton';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  onNavigateToLogin: () => void;
  loading?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  onNavigateToLogin,
  loading = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      countryCode: '+1',
    },
  });

  const password = watch('password');

  const handleSocialSignup = (provider: string) => {
    console.log(`Sign up with ${provider}`);
    // Implement social signup logic
  };

  return (
    <View className="flex-1 px-6">
      <Text className="text-3xl font-bold text-gray-900 mb-8">
        Create an account
      </Text>

      <Input
        control={control}
        name="email"
        label="Enter your email address"
        placeholder="yourmail@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon="email"
        error={errors.email}
      />

      <Input
        control={control}
        name="password"
        label="Enter your password:"
        placeholder="••••••••••"
        secureTextEntry={!showPassword}
        leftIcon="lock"
        rightIcon={showPassword ? 'visibility-off' : 'visibility'}
        onRightIconPress={() => setShowPassword(!showPassword)}
        error={errors.password}
      />

      <Input
        control={control}
        name="phoneNumber"
        label="Enter your mobile number:"
        placeholder="+1 Mobile number"
        keyboardType="phone-pad"
        leftIcon="phone"
        error={errors.phoneNumber}
      />

      <Button
        title="Continue"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        disabled={!isValid || loading}
        className="mb-6"
      />

      <Text className="text-center text-gray-500 mb-6">or</Text>

      <SocialButton
        provider="apple"
        onPress={() => handleSocialSignup('apple')}
        disabled={loading}
      />

      <SocialButton
        provider="facebook"
        onPress={() => handleSocialSignup('facebook')}
        disabled={loading}
      />

      <SocialButton
        provider="google"
        onPress={() => handleSocialSignup('google')}
        disabled={loading}
      />

      <View className="flex-row justify-center mt-6">
        <Text className="text-xs text-gray-500 text-center">
          By signing up, you agree to our{' '}
          <Text className="text-blue-600">Terms of Service</Text> and{' '}
          <Text className="text-blue-600">Privacy Policy</Text>
        </Text>
      </View>

      <View className="flex-row justify-center mt-4">
        <Text className="text-gray-600">Already had an account? </Text>
        <TouchableOpacity onPress={onNavigateToLogin}>
          <Text className="text-blue-600 font-semibold">Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterForm;
