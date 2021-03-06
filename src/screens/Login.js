import React, { Component } from 'react';
import {
    ActivityIndicator,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import firebase from 'firebase';
import Modal from 'react-native-modal';

import Button from '../components/common/Button';

class Login extends Component {
    state = {
        email: '',
        password: '',
        cargando: false,
        error: false
    };

    loadOrButton() {
        return this.state.cargando ? <ActivityIndicator size="large" color='#36175E'/> : <Button onPress={this.onClickLogin.bind(this)}>Log In</Button>
    }

    componentWillMount() {
        this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const { datos } = this.props.navigation.state.params;
                const resetAction = StackActions.reset({
                   index: 0,
                   actions: [NavigationActions.navigate({ routeName: 'Root', params: this.props.navigation.state.params })]
                });
                this.props.navigation.dispatch(resetAction);
            }
        });
    }

    componentWillUnmount() {
        this.authSubscription();
    }

    onClickLogin() {
        const { email, password } = this.state;
        this.setState({ cargando: true });
        firebase.auth().signInWithEmailAndPassword(email.toLowerCase(), password)
            .then((user) => {
                const resetAction = StackActions.reset({
                   index: 0,
                   actions: [NavigationActions.navigate({ routeName: 'Root', params: this.props.navigation.state.params })]
                });
                this.props.navigation.dispatch(resetAction);
            })
            .catch((err) => {
                this.setState({ cargando: false, error: true })
            });
    }

    onPressGuest() {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Root', params: this.props.navigation.state.params })]
        });
        this.props.navigation.dispatch(resetAction);
    }

    onPressForgot() {
        this.props.navigation.navigate('Recovery');
    }

    onPressRegister() {
        this.props.navigation.navigate('Register');
    }

    underlineColor() {
        return this.state.error ? 'red' : '#36175E';
    }

    render() {
        return (
            <View style={{ height: '100%', width: '100%' }}>
                <View style={{ height: '10%' }}/>
                <View style={styles.contenedorImagen}>
                    <Image
                        source={require('../assets/LogoC.png')}
                        style={styles.logoStyle}
                    />
                </View>
                <View style={{ height: '70%' }}>
                    <View style={styles.form}>
                        <View style={styles.textContainer}>
                            <TextInput
                                placeholder={'Email'}
                                autoCorrect={false}
                                onChangeText={(text) => {
                                    this.setState({ email: text });
                                    if (this.state.error) {
                                        this.setState({ error: false });
                                    }
                                }}
                                value={this.state.email}
                                style={styles.emailField}
                                underlineColorAndroid={this.underlineColor()}
                                selectionColor={'rgba(54, 23, 94, 0.7)'}
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <TextInput
                                placeholder={'Password'}
                                autoCorrect={false}
                                secureTextEntry
                                onChangeText={(text) => {
                                    this.setState({ password: text });
                                    if (this.state.error) {
                                        this.setState({ error: false });
                                    }
                                }}
                                value={this.state.password}
                                style={styles.passwordField}
                                underlineColorAndroid={this.underlineColor()}
                                selectionColor={'rgba(54, 23, 94, 0.7)'}
                            />
                        </View>
                    </View>
                    <View style={styles.loginButtonContainer}>
                        {this.loadOrButton()}
                    </View>
                    <View style={styles.otherTextContainer}>
                        <Text style={styles.otherText}>or go in as a</Text>
                    </View>
                    <View style={styles.otherOptionsContainer}>
                        <Button onPress={this.onPressGuest.bind(this)}>
                            <Text style={styles.buttonText}>Guest</Text>
                        </Button>
                    </View>
                    <View style={styles.opacityContainer}>
                        <TouchableOpacity onPress={this.onPressRegister.bind(this)}>
                            <Text style={styles.opacityText}>Register</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.onPressForgot.bind(this)}>
                            <Text style={styles.opacityText}>I forgot my password!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = {
    logoStyle: {
        resizeMode: 'contain',
        flex: 1
    },
    contenedorImagen: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '20%'
    },
    form: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '40%'
    },
    emailField: {
        width: '70%',
        paddingLeft: 5,
        paddingBottom: 8
    },
    passwordField: {
        width: '70%',
        paddingLeft: 5,
        paddingBottom: 8
    },
    textContainer: {
        paddingBottom: 10,
        width: '100%',
        alignItems: 'center'
    },
    loginButtonContainer: {
        height: '10%',
        width: '50%',
        alignSelf: 'center'
    },
    otherOptionsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        alignSelf: 'center',
        height: '10%'
    },
    otherText: {
        paddingLeft: 5,
        paddingRight: 5
    },
    otherTextContainer: {
        height: '10%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    opacityContainer: {
        alignItems: 'center',
        paddingTop: '5%',
        height: '32%'
    },
    opacityText: {
        color: '#a9a9a9',
        textDecorationLine: 'underline',
        paddingBottom: 5,
        fontSize: 16
    }
};

export default Login;