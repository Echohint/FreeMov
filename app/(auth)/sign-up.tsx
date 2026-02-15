import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/theme';
import { useSignUp, useOAuth } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
    useWarmUpBrowser();
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState('');
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

    const onSignUpPress = async () => {
        if (!isLoaded) return;
        setLoading(true);

        try {
            await signUp.create({
                emailAddress,
                password,
            });

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setPendingVerification(true);
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            alert(err.errors?.[0]?.message || 'Sign up failed');
        } finally {
            setLoading(false);
        }
    };

    const onVerifyPress = async () => {
        if (!isLoaded) return;
        setLoading(true);

        try {
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId });
                router.replace('/');
            } else {
                console.error(JSON.stringify(signUpAttempt, null, 2));
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            alert(err.errors?.[0]?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    if (pendingVerification) {
        return (
            <ThemedView style={styles.container}>
                <View style={styles.formContainer}>
                    <ThemedText type="title" style={styles.subHeader}>Verify Email</ThemedText>
                    <ThemedText style={styles.description}>
                        We've sent a code to {emailAddress}.
                    </ThemedText>

                    <TextInput
                        value={code}
                        placeholder="Enter verification code"
                        placeholderTextColor="#8c8c8c"
                        onChangeText={setCode}
                        keyboardType="numeric"
                        style={styles.input}
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={onVerifyPress}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.buttonText}>Verify</ThemedText>}
                    </TouchableOpacity>
                </View>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <View style={styles.formContainer}>
                <ThemedText type="title" style={styles.header}>FreeMov</ThemedText>
                <ThemedText style={styles.subHeader}>Sign Up</ThemedText>

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
                        placeholder="Email address"
                        placeholderTextColor="#8c8c8c"
                        onChangeText={setEmailAddress}
                        keyboardType="email-address"
                        style={styles.input}
                    />
                    <TextInput
                        value={password}
                        placeholder="Add a password"
                        placeholderTextColor="#8c8c8c"
                        secureTextEntry={true}
                        onChangeText={setPassword}
                        style={styles.input}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={onSignUpPress}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <ThemedText style={styles.buttonText}>Start Membership</ThemedText>
                    )}
                </TouchableOpacity>

                <View style={styles.footer}>
                    <ThemedText style={{ color: '#737373' }}>Already have an account? </ThemedText>
                    <Link href="/(auth)/sign-in">
                        <ThemedText style={styles.link}>Sign in.</ThemedText>
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
    formContainer: {
        padding: 20,
        gap: 16,
    },
    header: {
        color: Colors.primary,
        fontSize: 40,
        marginBottom: 10,
        textAlign: 'center',
    },
    subHeader: {
        fontSize: 28, // Slightly smaller than login
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    description: {
        color: '#b3b3b3',
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
