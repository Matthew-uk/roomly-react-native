import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';
import { LoginFormData } from '../../types/auth';
import { validateEmail, validatePassword } from '../../utils/validation';
import Button from './../common/Button';
import Input from './../common/Input';
import SocialButton from './../common/SocialButton';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  onNavigateToRegister: () => void;
  loading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onNavigateToRegister,
  loading = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Implement social login logic
  };

  return (
    <View className="flex-1 px-6">
      <Text className="text-3xl font-bold text-gray-900 mb-8">Login</Text>

      <Input
        control={control}
        name="email"
        label="Enter your email address"
        placeholder="yourmail@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon="email"
        rules={{
          required: 'Email is required',
          validate: validateEmail,
        }}
        error={errors.email}
      />

      <Input
        control={control}
        name="password"
        label="Enter your password"
        placeholder="••••••••••"
        secureTextEntry={!showPassword}
        leftIcon="lock"
        rightIcon={showPassword ? 'visibility-off' : 'visibility'}
        onRightIconPress={() => setShowPassword(!showPassword)}
        rules={{
          required: 'Password is required',
          validate: validatePassword,
        }}
        error={errors.password}
      />

      <Button
        title="Login"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        disabled={!isValid || loading}
        className="mb-6"
      />

      <Text className="text-center text-gray-500 mb-6">or</Text>

      <SocialButton
        provider="apple"
        onPress={() => handleSocialLogin('apple')}
        disabled={loading}
      />

      <SocialButton
        provider="facebook"
        onPress={() => handleSocialLogin('facebook')}
        disabled={loading}
      />

      <SocialButton
        provider="google"
        onPress={() => handleSocialLogin('google')}
        disabled={loading}
      />

      <View className="flex-row justify-center mt-8">
        <Text className="text-gray-600">Don't have an account? </Text>
        <TouchableOpacity onPress={onNavigateToRegister}>
          <Text className="text-blue-600 font-semibold">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginForm;
