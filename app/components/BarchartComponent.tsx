import { View, Text, ScrollView } from "react-native";
import CustomBarChart from "./CustomBarChart";

const BarchartComponent = ({ data }: { data: number[] }) => {
  const chartWidth = data.length * 40;
  return (
    <View className="mt-10">
      <Text className=" ml-5 font-rubik-bold text-3xl text-sky-500">
        Barchart Visualization
      </Text>
      <Text className=" text-center font-rubik-medium mt-5 text-xl tracking-wide text-red-500">
        Scroll Horizontally to View
      </Text>
      <View className=" mt-3 flex flex-col">
        <Text className=" text-center font-rubik-medium text-lg tracking-wide text-blue-500">
          X Axis - Days of the Month
        </Text>
        <Text className=" text-center font-rubik-medium text-lg tracking-wide text-blue-500">
          Y Axis - Expenses
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className=" mx-5"
      >
        <CustomBarChart
          data={{
            labels: Array.from({ length: data.length }, (_, i) =>
              (i + 1).toString()
            ),
            datasets: [{ data }],
          }}
          width={chartWidth - 20}
          height={300}
          yAxisLabel="₹"
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#f7f9fc",
            backgroundGradientTo: "#e6eef9",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(34, 128, 230, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </ScrollView>
    </View>
  );
};
export default BarchartComponent;
