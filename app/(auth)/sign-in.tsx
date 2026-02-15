import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/theme';
import { useSignIn, useOAuth } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, ImageBackground, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
    useWarmUpBrowser();
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const onSelectAuth = async () => {
        try {
            const { createdSessionId, setActive } = await startOAuthFlow();
            if (createdSessionId) {
                setActive!({ session: createdSessionId });
                router.replace('/');
            }
        } catch (err) {
            console.error('OAuth error', err);
        }
    };

    const onSignInPress = async () => {
        if (!isLoaded) return;
        setLoading(true);

        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId });
                router.replace('/');
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            alert(err.errors?.[0]?.message || 'Sign in failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            {/* Background Image Placeholder - ideally use a local asset or URL */}
            <View style={styles.overlay} />

            <View style={styles.formContainer}>
                <ThemedText type="title" style={styles.header}>FreeMov</ThemedText>
                <ThemedText style={styles.subHeader}>Sign In</ThemedText>

                <TouchableOpacity style={styles.oauthButton} onPress={onSelectAuth}>
                    <ThemedText style={styles.oauthButtonText}>Continue with Google</ThemedText>
                </TouchableOpacity>

                <View style={styles.divider}>
                    <View style={styles.line} />
                    <ThemedText style={styles.orText}>OR</ThemedText>
                    <View style={styles.line} />
                </View>

                <View style={styles.inputGroup}>
                    <TextInput
                        autoCapitalize="none"
                        value={emailAddress}
                        placeholder="Email or phone number"
                        placeholderTextColor="#8c8c8c"
                        onChangeText={setEmailAddress}
                        style={styles.input}
                    />
                    <TextInput
                        value={password}
                        placeholder="Password"
                        placeholderTextColor="#8c8c8c"
                        secureTextEntry={true}
                        onChangeText={setPassword}
                        style={styles.input}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={onSignInPress}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <ThemedText style={styles.buttonText}>Sign In</ThemedText>
                    )}
                </TouchableOpacity>

                <View style={styles.footer}>
                    <ThemedText style={{ color: '#737373' }}>New to FreeMov? </ThemedText>
                    <Link href="/(auth)/sign-up">
                        <ThemedText style={styles.link}>Sign up now.</ThemedText>
                    </Link>
                </View>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        padding: 20,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)', // Dim background
    },
    formContainer: {
        backgroundColor: 'rgba(0,0,0,0.75)',
        padding: 30,
        borderRadius: 8,
        gap: 20,
    },
    header: {
        color: Colors.primary,
        fontSize: 40,
        marginBottom: 10,
        textAlign: 'center',
    },
    subHeader: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    oauthButton: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 20,
    },
    oauthButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 10,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#333',
    },
    orText: {
        color: '#666',
    },
    inputGroup: {
        gap: 16,
    },
    input: {
        backgroundColor: '#333',
        borderRadius: 4,
        color: '#fff',
        padding: 16,
        fontSize: 16,
    },
    button: {
        backgroundColor: Colors.primary,
        padding: 16,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 24,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        marginTop: 30,
        alignItems: 'center',
    },
    link: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
