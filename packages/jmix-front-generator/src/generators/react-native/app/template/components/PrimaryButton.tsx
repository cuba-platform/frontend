import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  StyleSheet, View, ViewStyle
} from "react-native";
import React, { FunctionComponent } from "react";
import { colors } from "../styles/palette";

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 4,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    color: colors.textInverted,
    fontSize: 18
  }
});

export type PrimaryButtonProps = {
  onPress: () => void;
  loading: boolean;
  style: ViewStyle;
  disabled: boolean;
};

export const PrimaryButton: FunctionComponent<PrimaryButtonProps> = ({ onPress, loading, style, disabled, children }) => {
  return (
    <View style={style}>
      <TouchableOpacity style={[
                          styles.button,
                          disabled && {opacity: 0.5}
                        ]}
                        onPress={onPress}
                        disabled={disabled}
      >
        {loading ? (
          <ActivityIndicator color={colors.textInverted}/>
        ) : (
          <Text style={styles.text}>{children}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
