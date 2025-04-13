import { zincColors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useColorScheme, View, ViewStyle } from "react-native";

interface CardProps extends React.PropsWithChildren {
  style?: ViewStyle;
}

export default function Card({ children, style = {} }: CardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const getBgColor = () => {
    return isDark ? zincColors[500] : zincColors[300];
  };

  return (
    <View
      style={{
        padding: 15,
        borderRadius: 15,
        backgroundColor: getBgColor(),
        elevation: 8,
        shadowColor: "#000",
        shadowRadius: 8,
        shadowOffset: { height: 6, width: 0 },
        shadowOpacity: 0.15,
        ...style,
      }}
    >
      {children}
    </View>
  );
}
