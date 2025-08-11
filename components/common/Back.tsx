import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

const Back = ({ className }: { className?: string }) => {
  return (
    <TouchableOpacity
      className={`mb-6 ${className}`}
      onPress={() => router.back()}
    >
      <ArrowLeft size={24} color="#1F2937" />
    </TouchableOpacity>
  );
};

export default Back;
