import axios, { AxiosError } from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Back from '@/components/common/Back';
import Button from '@/components/common/Button';
import { useRegisterStore } from '@/store/register.store';
import Toast from 'react-native-toast-message';

const OTP_LENGTH = 6;
const RESEND_TIME = 59;

const OTPPage: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(RESEND_TIME);
  const [isResending, setIsResending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //   const [resendLoading, setResendLoading] = useState(false);
  const inputs = useRef<TextInput[]>([]);
  const { email } = useRegisterStore();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const focusInput = (index: number) => {
    if (index < OTP_LENGTH) {
      inputs.current[index]?.focus();
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];

    // Paste logic on first input
    if (index === 0 && value.length === OTP_LENGTH && /^\d+$/.test(value)) {
      const pastedDigits = value.split('');
      setOtp(pastedDigits);
      inputs.current[OTP_LENGTH - 1]?.focus();
      return;
    }

    // Single digit logic
    if (/^\d$/.test(value)) {
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < OTP_LENGTH - 1) {
        focusInput(index + 1);
      }
    }
  };

  const handleBackspace = (index: number) => {
    const newOtp = [...otp];

    if (otp[index] === '') {
      if (index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        focusInput(index - 1);
      }
    } else {
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const handleSubmit = async () => {
    const code = otp.join('');
    if (code.length !== OTP_LENGTH || otp.includes('')) {
      Alert.alert('Invalid OTP', `Please enter all ${OTP_LENGTH} digits.`);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        'https://roomy-backend-duq2.onrender.com/api/users/verify',
        { email, code },
      );
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Your account has been verified!',
      });
      console.log(response.data);
      router.push('/(auth)/login');
    } catch (err: AxiosError | any) {
      console.error(
        'OTP verification error:',
        err.response?.data || err.message,
      );
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: err.response?.data?.message || 'Please try again.',
        text1Style: { fontSize: 16, fontFamily: 'Montserrat-Bold' },
        text2Style: { fontSize: 14, fontFamily: 'Montserrat-Regular' },
      });
      Alert.alert('Error', 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0 || isResending) return;
    setIsResending(true);
    try {
      await axios.post(
        'https://roomy-backend-duq2.onrender.com/api/users/resend-verification',
        { email },
      );
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'OTP resent successfully!',
      });
      //   Alert.alert('OTP Resent', 'A new code has been sent to your email.');
      setOtp(Array(OTP_LENGTH).fill(''));
      setTimer(RESEND_TIME);
    } catch (err) {
      console.error('Resend error:', err);
      Alert.alert('Error', 'Could not resend OTP.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView className="flex flex-col p-6 bg-white h-full">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
          <Back className="mb-4" />
          <Text className="text-2xl font-medium mb-4">Enter the Code</Text>
          <Text className="text-base mb-6 text-gray-700 font-regular">
            Enter the 6-digit verification code sent to your email (
            <Text className="font-medium">{email}</Text>).
          </Text>

          <View className="flex-row flex-wrap justify-between mb-6">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputs.current[index] = ref;
                }}
                className="w-[45px] h-[50px] text-center text-2xl mx-[3px] my-[4px] bg-[#f3f3f3] border border-gray-300 rounded-md"
                keyboardType="numeric"
                maxLength={index === 0 ? OTP_LENGTH : 1}
                textContentType={index === 0 ? 'oneTimeCode' : 'none'}
                autoComplete={index === 0 ? 'sms-otp' : 'off'}
                value={digit}
                placeholder="0"
                onChangeText={(value) => handleOtpChange(index, value)}
                onKeyPress={(
                  e: NativeSyntheticEvent<TextInputKeyPressEventData>,
                ) => {
                  if (e.nativeEvent.key === 'Backspace') {
                    handleBackspace(index);
                  }
                }}
              />
            ))}
          </View>

          <View className="mb-6">
            {timer > 0 ? (
              <Text
                className={`text-center font-regular text-gray-500`}
                disabled={isResending}
              >
                Resend code in{' '}
                <Text className="font-bold text-primary">{timer}s</Text>
              </Text>
            ) : (
              <Text
                className={`text-center text-primary font-medium ${
                  isResending ? 'opacity-50' : ''
                }`}
                onPress={handleResendOTP}
              >
                Resend OTP
              </Text>
            )}
          </View>

          <Button
            title={isLoading ? 'Loading...' : 'Submit'}
            className={isLoading ? 'opacity-50' : ''}
            onPress={handleSubmit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OTPPage;
