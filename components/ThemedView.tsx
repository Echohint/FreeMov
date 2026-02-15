import { View, type ViewProps } from 'react-native';
import { Colors } from '@/constants/theme';

export type ThemedViewProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
};

export function ThemedView({ style, ...otherProps }: ThemedViewProps) {
    // FreeMov is always Dark Mode, so we default to black/surface
    const backgroundColor = Colors.background;

    return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
