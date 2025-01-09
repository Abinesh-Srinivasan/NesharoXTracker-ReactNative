import React from "react";
import { View, Text } from "react-native";
import * as Progress from "react-native-progress";

interface ProgressChartComponentProps {
  data: { name: string; amount: number; color: string }[];
}

const ProgressChartComponent = ({ data }: ProgressChartComponentProps) => {
  if (data.length === 0) {
    return (
      <View className="mx-5 mt-14 mb-10">
        <Text className="text-3xl font-rubik-bold text-fuchsia-500 mb-8">
          Progress Chart
        </Text>
        <Text className="text-xl font-rubik-medium text-slate-700 text-center mt-20">
          You made no expenses today
        </Text>
      </View>
    );
  }
  // Calculate total expenses
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <View className="mx-5 mt-14 mb-10">
      <Text className="text-3xl font-rubik-bold text-fuchsia-500 mb-8">
        Progress Chart
      </Text>

      {data.map((item, index) => {
        const progress = item.amount / totalAmount;

        return (
          <View key={index} className="mb-5 px-4">
            {/* Name and amount */}
            <View className="flex-row justify-between mb-2">
              <Text
                className="font-rubik-bold text-xl tracking-wide"
                style={{ color: item.color }}
              >
                {item.name}
              </Text>
              <Text className="text-slate-700 font-rubik-medium tracking-wider">
                ₹{item.amount}
              </Text>
            </View>

            {/* Progress bar */}
            <Progress.Bar
              progress={progress} // between 0 and 1
              width={null}
              height={10}
              color={item.color}
              unfilledColor="#e0e0e0"
              borderWidth={0}
              style={{ borderRadius: 5 }}
            />
          </View>
        );
      })}
    </View>
  );
};

export default ProgressChartComponent;
