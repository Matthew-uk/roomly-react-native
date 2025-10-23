import { FormField } from '@/components/forms/FormField';
import axios from 'axios';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  interface LoginFormData {
    email: string;
    password: string;
  }

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://roomy-backend-duq2.onrender.com/api/auth/login',
        data,
      );
      console.log(response.data);
      SecureStore.setItemAsync('token', response.data.token);
      SecureStore.setItemAsync('user', JSON.stringify(response.data.user));

      Toast.show({
        type: 'success',
        text1: 'Login Successful',
      });
      setTimeout(() => router.replace('/(dashboard)'), 1000);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.response?.data?.message || 'Invalid credentials',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1 px-6 py-4"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity className="mb-6" onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>

          <Text className="text-2xl font-bold text-gray-900 mb-6">
            Welcome back
          </Text>

          {/* Email */}
          <FormField
            label="Enter your email address"
            name="email"
            icon={<Mail size={17} color="#6B7280" />}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Invalid email format',
              },
            }}
            error={errors.email}
          />

          {/* Password */}
          <FormField
            label="Enter your password"
            name="password"
            icon={<Lock size={17} color="#6B7280" />}
            placeholder="••••••••••••"
            secureTextEntry={!showPassword}
            control={control}
            rules={{ required: 'Password is required' }}
            error={errors.password}
            rightIcon={
              <TouchableOpacity
                className="absolute right-4"
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={17} color="#6B7280" />
                ) : (
                  <Eye size={17} color="#6B7280" />
                )}
              </TouchableOpacity>
            }
          />

          <TouchableOpacity
            className={
              isLoading
                ? 'bg-primary/50 rounded-xl py-4 items-center mb-6'
                : 'bg-primary rounded-xl py-4 items-center mb-6'
            }
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.8}
          >
            <Text className="font-medium text-white text-base">
              {isLoading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text className="font-regular text-center text-base text-gray-600">
              Don’t have an account?{' '}
              <Text className="text-gray-900 font-bold">Sign up</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(dashboard)')}
            className="mt-4"
          >
            <Text className="font-regular text-center text-base text-gray-600">
              Route to Dashboard{' '}
              <Text className="text-gray-900 font-bold">Dashboard</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
