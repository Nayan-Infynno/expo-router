import { COLORS } from "@/src/constants/theme";
import { useColorScheme } from "react-native";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof COLORS.light & keyof typeof COLORS.dark
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return COLORS[theme][colorName];
  }
}
