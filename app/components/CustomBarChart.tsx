import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Svg, {
  Rect,
  G,
  Text,
  Line,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";

interface ChartConfig {
  backgroundColor?: string;
  backgroundGradientFrom?: string;
  backgroundGradientTo?: string;
  decimalPlaces?: number;
  color?: (opacity: number) => string;
  labelColor?: (opacity: number) => string;
  style?: {
    borderRadius?: number;
  };
}

interface CustomBarChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
  width: number;
  height: number;
  yAxisLabel?: string;
  yAxisSuffix?: string;
  chartConfig?: ChartConfig;
  style?: object;
}

const CustomBarChart: React.FC<CustomBarChartProps> = ({
  data,
  width,
  height,
  yAxisLabel = "",
  yAxisSuffix = "",
  chartConfig = {},
  style = {},
}) => {
  const { labels, datasets } = data;
  const barWidth = 32;
  const paddingLeft = 40;
  const paddingRight = 10;

  // Fixed bar gap value
  const fixedBarGap = 70;

  // Calculate total chart width based on the number of bars and gaps
  const totalChartWidth =
    paddingLeft +
    paddingRight +
    datasets[0].data.length * (barWidth + fixedBarGap);

  const maxYValue = Math.max(...datasets[0].data);

  const chartStyles = {
    backgroundColor: chartConfig.backgroundColor || "#ffffff",
    gradientFrom: chartConfig.backgroundGradientFrom || "#f7f9fc",
    gradientTo: chartConfig.backgroundGradientTo || "#e6eef9",
    decimalPlaces: chartConfig.decimalPlaces || 0,
    barColor: chartConfig.color || (() => `rgba(34, 128, 230, 1)`),
    labelColor: chartConfig.labelColor || (() => `rgba(0, 0, 0, 1)`),
    borderRadius: chartConfig.style?.borderRadius || 0,
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: chartStyles.backgroundColor },
        style,
      ]}
    >
      <ScrollView horizontal>
        <Svg width={totalChartWidth} height={height}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <Stop
                offset="0%"
                stopColor={chartStyles.gradientFrom}
                stopOpacity="1"
              />
              <Stop
                offset="100%"
                stopColor={chartStyles.gradientTo}
                stopOpacity="1"
              />
            </LinearGradient>
          </Defs>
          <Rect
            x="0"
            y="0"
            width={totalChartWidth}
            height={height}
            fill="url(#grad)"
            rx={chartStyles.borderRadius}
          />

          <Line
            x1={paddingLeft}
            y1={height - 30}
            x2={totalChartWidth - paddingRight}
            y2={height - 30}
            stroke="#ddd"
            strokeWidth="1"
          />

          {datasets[0].data.map((value, index) => {
            const barHeight = (value / maxYValue) * (height - 60);
            const xPos = paddingLeft + index * (barWidth + fixedBarGap);

            return (
              <G key={index}>
                <Rect
                  x={xPos}
                  y={height - 30 - barHeight}
                  width={barWidth}
                  height={barHeight}
                  fill={chartStyles.barColor(1)}
                />

                <Text
                  x={xPos + barWidth / 2}
                  y={height - 30 - barHeight - 12}
                  textAnchor="middle"
                  fontSize="12"
                  fontFamily="rubik-medium"
                  fill={chartStyles.labelColor(1)}
                >
                  {`${yAxisLabel}${value}${yAxisSuffix}`}
                </Text>

                <Text
                  x={xPos + barWidth / 2}
                  y={height - 10}
                  textAnchor="middle"
                  fontSize="12"
                  fontFamily="rubik-medium"
                  fill={chartStyles.labelColor(1)}
                >
                  {labels[index]}
                </Text>
              </G>
            );
          })}
        </Svg>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
    borderRadius: 16,
    overflow: "hidden",
  },
});

export default CustomBarChart;
