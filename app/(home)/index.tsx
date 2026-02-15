import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/theme';
import { SignedIn, SignedOut, useUser, useClerk } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import { StyleSheet, TouchableOpacity, View, ImageBackground } from 'react-native';

export default function HomeScreen() {
    const { user } = useUser();
    const { signOut } = useClerk();

    return (
        <ThemedView style={styles.container}>
            <SignedOut>
                <ImageBackground
                    source={{ uri: 'https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg' }} // Placeholder Netflix BG
                    style={styles.bgImage}
                    resizeMode="cover"
                >
                    <View style={styles.overlay}>
                        <View style={styles.heroContent}>
                            <ThemedText type="title" style={styles.logo}>FreeMov</ThemedText>
                            <ThemedText type="subtitle" style={styles.heroTitle}>Unlimited movies, TV shows, and more.</ThemedText>
                            <ThemedText style={styles.heroSubtitle}>Watch anywhere. Cancel anytime.</ThemedText>

                            <Link href="/(auth)/sign-up" asChild>
                                <TouchableOpacity style={styles.ctaButton}>
                                    <ThemedText style={styles.ctaText}>Get Started</ThemedText>
                                </TouchableOpacity>
                            </Link>

                            <Link href="/(auth)/sign-in" asChild>
                                <TouchableOpacity style={{ marginTop: 20 }}>
                                    <ThemedText style={styles.loginLink}>Sign In</ThemedText>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </ImageBackground>
            </SignedOut>

            <SignedIn>
                <View style={styles.contentContainer}>
                    <ThemedText type="title">Welcome Back!</ThemedText>
                    <ThemedText style={styles.userEmail}>{user?.emailAddresses[0].emailAddress}</ThemedText>

                    <TouchableOpacity style={styles.logoutButton} onPress={() => signOut()}>
                        <ThemedText style={styles.logoutText}>Sign Out</ThemedText>
                    </TouchableOpacity>

                    <ThemedText style={{ marginTop: 40, color: '#666' }}>[Video Player & Content Rails Coming Soon]</ThemedText>
                </View>
            </SignedIn>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    bgImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    heroContent: {
        alignItems: 'center',
        width: '100%',
    },
    logo: {
        color: Colors.primary,
        fontSize: 50,
        fontWeight: '900',
        marginBottom: 40,
    },
    heroTitle: {
        color: '#fff',
        fontSize: 40,
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: 'bold',
    },
    heroSubtitle: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 30,
    },
    ctaButton: {
        backgroundColor: Colors.primary,
        width: '100%',
        paddingVertical: 16,
        borderRadius: 4,
        alignItems: 'center',
    },
    ctaText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginLink: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    userEmail: {
        color: '#b3b3b3',
        fontSize: 18,
        marginVertical: 10,
    },
    logoutButton: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#333',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 4,
    },
    logoutText: {
        color: '#fff',
    },
});
