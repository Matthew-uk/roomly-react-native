import { FormField } from '@/components/forms/FormField';
import { useRegisterStore } from '@/store/register.store';
import axios from 'axios';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
} from 'lucide-react-native';
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

export default function SignupScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setName, setEmail } = useRegisterStore();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
    },
  });

  interface SignupFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
  }

  interface ApiResponse {
    data: {
      message: string;
    };
  }

  const onSubmit = async (data: SignupFormData): Promise<void> => {
    console.log('Form Data:', { ...data, role: 'owner' });
    try {
      setIsLoading(true);
      const response: ApiResponse = await axios.post(
        'https://roomy-backend-duq2.onrender.com/api/users/',
        data,
      );
      console.log(response);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Account created successfully!',
      });
      setName(data.name);
      setEmail(data.email);
      router.push('/(auth)/otp');
      //   setTimeout(() => router.replace('/(tabs)/dashboard'), 1000);
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: error.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const password = watch('password');

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
            Create an account
          </Text>

          {/* Username */}
          <FormField
            label="Enter your username"
            name="name"
            icon={<User size={17} color="#6B7280" />}
            placeholder="Username"
            control={control}
            rules={{ required: 'Username is required' }}
            error={errors.name}
          />

          {/* Email */}
          <FormField
            label="Enter your email address"
            name="email"
            icon={<Mail size={17} color="#6B7280" />}
            placeholder="yourmail@example.com"
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

          {/* Confirm Password */}
          <FormField
            label="Confirm your password"
            name="confirmPassword"
            icon={<Lock size={17} color="#6B7280" />}
            placeholder="••••••••••••"
            secureTextEntry={!showConfirmPassword}
            control={control}
            rules={{
              required: 'Please confirm your password',
              validate: (value: string) =>
                value === password || 'Passwords do not match',
            }}
            error={errors.confirmPassword}
            rightIcon={
              <TouchableOpacity
                className="absolute right-4"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={17} color="#6B7280" />
                ) : (
                  <Eye size={17} color="#6B7280" />
                )}
              </TouchableOpacity>
            }
          />

          {/* Phone Number */}
          <FormField
            label="Enter your mobile number"
            name="phoneNumber"
            icon={<Phone size={17} color="#6B7280" />}
            placeholder="+1 Mobile number"
            keyboardType="phone-pad"
            control={control}
            rules={{ required: 'Phone number is required' }}
            error={errors.phoneNumber}
          />

          <TouchableOpacity
            className={`bg-primary rounded-xl py-4 items-center mb-6 ${
              isLoading ? 'opacity-50' : ''
            }`}
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.8}
          >
            <Text className="font-medium text-white text-base">
              {isLoading ? 'Loading...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text className="font-regular text-center text-base text-gray-600">
              Already have an account?{' '}
              <Text className="text-gray-900 font-bold">Log in</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
