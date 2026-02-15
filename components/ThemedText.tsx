import { Text, type TextProps, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
    type?: 'default' | 'title' | 'subtitle' | 'link' | 'caption';
};

export function ThemedText({ style, type = 'default', ...rest }: ThemedTextProps) {
    return (
        <Text
            style={[
                { color: Colors.text },
                type === 'default' ? styles.default : undefined,
                type === 'title' ? styles.title : undefined,
                type === 'subtitle' ? styles.subtitle : undefined,
                type === 'link' ? styles.link : undefined,
                type === 'caption' ? styles.caption : undefined,
                style,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        fontSize: 16,
        lineHeight: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        lineHeight: 32,
        color: Colors.text,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
    },
    link: {
        lineHeight: 30,
        fontSize: 16,
        color: Colors.primary,
    },
    caption: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
});
