import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AuthScreen() {
  const { mode } = useLocalSearchParams();
  const isLogin = mode === 'login';

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleAuth = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isLogin) {
      if (!phoneNumber || !confirmPassword) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
    }

    // Simulate authentication
    setTimeout(() => {
      router.replace('/(tabs)/bookings');
    }, 500);
  };

  const handleSocialAuth = (provider: string) => {
    // Simulate social authentication
    setTimeout(() => {
      router.replace('/(tabs)/bookings');
    }, 500);
  };

  const switchMode = () => {
    const newMode = isLogin ? 'signup' : 'login';
    router.setParams({ mode: newMode });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>
              {isLogin ? 'Login' : 'Create an account'}
            </Text>

            <View style={styles.form}>
              {!isLogin && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Enter your username</Text>
                  <View style={styles.inputWrapper}>
                    <User size={20} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      //   className='flex-1 text-base font-regular text-gray-900'
                      value={userName}
                      onChangeText={setUserName}
                      placeholder="yourusername"
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="none"
                    />
                  </View>
                </View>
              )}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Enter your email address</Text>
                <View style={styles.inputWrapper}>
                  <Mail size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="yourmail@example.com"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  {isLogin ? 'Enter your password' : 'Enter your password:'}
                </Text>
                <View style={styles.inputWrapper}>
                  <Lock size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••••••"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#6B7280" />
                    ) : (
                      <Eye size={20} color="#6B7280" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {!isLogin && (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Enter your mobile number:</Text>
                    <View style={styles.phoneInputWrapper}>
                      <View style={styles.countryCode}>
                        <Text style={styles.flag}>🇺🇸</Text>
                        <ArrowLeft
                          size={16}
                          color="#6B7280"
                          style={{ transform: [{ rotate: '-90deg' }] }}
                        />
                      </View>
                      <TextInput
                        style={styles.phoneInput}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder="+1 Mobile number"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Confirm your password:</Text>
                    <View style={styles.inputWrapper}>
                      <Lock
                        size={20}
                        color="#6B7280"
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={[styles.input, styles.passwordInput]}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="••••••••••••"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry={!showConfirmPassword}
                      />
                      <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} color="#6B7280" />
                        ) : (
                          <Eye size={20} color="#6B7280" />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </View>

            <View style={styles.buttonSection}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleAuth}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>
                  {isLogin ? 'Login' : 'Continue'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.orText}>or</Text>

              <View style={styles.socialButtons}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleSocialAuth('apple')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.appleIcon}>🍎</Text>
                  <Text style={styles.socialButtonText}>
                    Continue with Apple
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, styles.facebookButton]}
                  onPress={() => handleSocialAuth('facebook')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.facebookIcon}>f</Text>
                  <Text style={[styles.socialButtonText, styles.facebookText]}>
                    Continue with Facebook
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, styles.googleButton]}
                  onPress={() => handleSocialAuth('google')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.googleIcon}>G</Text>
                  <Text style={[styles.socialButtonText, styles.googleText]}>
                    Continue with Google
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  By signing up, you agree to our{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                  <Text style={styles.termsLink}>Privacy Policy.</Text>
                </Text>
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.switchText}>
                  {isLogin
                    ? "Don't have an account? "
                    : 'Already had an account? '}
                </Text>
                <TouchableOpacity onPress={switchMode}>
                  <Text style={styles.switchLink}>
                    {isLogin ? 'Sign Up' : 'Log in'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 27,
    fontFamily: 'Montserrat-Bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#1F2937',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#1F2937',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  flag: {
    fontSize: 20,
    fontFamily: 'Montserrat-Regular',
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#1F2937',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  buttonSection: {
    gap: 24,
  },
  primaryButton: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },
  orText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Montserrat-Regular',
  },
  socialButtons: {
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  socialButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    marginLeft: 12,
    color: '#1F2937',
  },
  appleIcon: {
    fontSize: 18,
    fontFamily: 'Montserrat-Regular',
  },
  facebookButton: {
    backgroundColor: '#1877F2',
  },
  facebookIcon: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#FFFFFF',
  },
  facebookText: {
    color: '#FFFFFF',
  },
  googleButton: {
    borderColor: '#D1D5DB',
  },
  googleIcon: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#EA4335',
  },
  googleText: {
    color: '#EA4335',
  },
  termsContainer: {
    marginTop: 16,
    paddingHorizontal: 12,
  },
  termsText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Montserrat-Regular',
  },
  termsLink: {
    color: '#1F2937',
    fontFamily: 'Montserrat-Regular',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  switchText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Montserrat-Regular',
  },
  switchLink: {
    fontSize: 14,
    color: '#1F2937',
    fontFamily: 'Montserrat-Bold',
  },
});
