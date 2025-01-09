import { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const DashboardHeader = ({
  dashboardContent,
  setDashboardContent,
}: {
  dashboardContent: string;
  setDashboardContent: (value: string) => void;
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const items = [
    { label: "This Month", value: "This Month" },
    { label: "Today", value: "Today" },
    { label: "Past Expenses", value: "Past Expenses" },
  ];

  const handleDashboardChange = (value: string) => {
    setDashboardContent(value);
    setDropdownVisible(!dropdownVisible);
  };
  return (
    <View className=" mt-10 pl-5 pr-5 flex flex-row w-full justify-between items-center">
      <Text className=" w-1/2 font-rubik-extrabold text-3xl text-violet-600">
        Dashboard
      </Text>
      <View className=" w-1/2 flex items-end">
        {/* dropdown head */}
        <TouchableOpacity
          className=" flex flex-row items-center gap-2"
          onPress={() => setDropdownVisible(!dropdownVisible)}
        >
          <Text className=" font-rubik-regular text-xl text-fuchsia-600">
            {dashboardContent}
          </Text>
          <Ionicons
            name={dropdownVisible ? "chevron-up" : "chevron-down"}
            color="#ff820a"
            size={15}
          />
        </TouchableOpacity>
        {/* dropdown menu */}
        {dropdownVisible && (
          <View className=" mt-3 absolute top-8 right-6 z-10 bg-white p-4">
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              ItemSeparatorComponent={() => <View className=" h-2"></View>}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleDashboardChange(item.value)}
                >
                  <Text className=" font-rubik-light text-lg text-sky-600">
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </View>
  );
};
export default DashboardHeader;
