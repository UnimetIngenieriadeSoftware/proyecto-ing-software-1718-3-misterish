import React, { Component } from 'react';
import { Image, Text, View, ActivityIndicator } from 'react-native';
import firebase from 'firebase';
import { BarCodeScanner, Camera, Location, Permissions } from 'expo';
import { StackActions, NavigationActions } from 'react-navigation';
import Alert from '../components/Alert';
import Modal from 'react-native-modal';
import Notepad from '../components/Notepad';

class CameraScanner extends Component {
    state = {
        doIHaveCameraPermission: null,
        doIHaveLocationPermission: null,
        location: undefined,
        cargando: true,
        clues: [],
        clueIndex: 0,
        GIF: false,
        modalVisible: false,
        victoria: false
    };

    async componentWillMount() {
        await this.askForCameraPermission();
        await this.askForLocationPermission();
    }

    async askForCameraPermission() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ doIHaveCameraPermission: status === 'granted' });
    }

    async askForLocationPermission() {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        this.setState({ doIHaveLocationPermission: status === 'granted' });
    }

    async getLocationAsync() {
        if (this.state.doIHaveLocationPermission) {
            let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
            console.log(location);
            this.setState({ location });
        }
    }

    async componentWillUpdate() {
        await this.getLocationAsync();
    }

    findClues() {
        const index = this.props.navigation.state.params;
        firebase.database().ref(`/misteryClues/${index}`).once('value')
            .then((snapshotClues) => {
                const clues = snapshotClues.val();
                this.setState({ cargando: false, clues });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    getMeOut() {
        this.setState({ modalVisible: true });
    }

    render() {
        const { doIHaveCameraPermission } = this.state;
        if (this.state.cargando) {
            this.findClues();
            return (
                <View style={styles.loadingView}>
                    <ActivityIndicator size='large' color="#36175E"/>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            );
        } else {
            if (doIHaveCameraPermission === null) {
                return (
                    <View>
                        <Text>Requesting Permission to use Your Camera</Text>
                    </View>
                );
            } else if (doIHaveCameraPermission === false) {
                // Handling error
                return (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>You Did Not Gave Us Permission to Use Your Camera</Text>
                    </View>
                );
            } else {
                if (this.state.GIF) {
                    return (
                        <View style={styles.gifContainer}>
                            <Image style={styles.GIF} source={require('../assets/celebration.gif')} />
                        </View>
                    );
                } else if (this.state.victoria) {
                    return (
                        <Modal
                            isVisible={true}
                            backdropColor={'rgba(54,23,94,0.8)'}
                            backdropOpacity={0.5}
                        >
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Alert
                                    title={'You did it!'}
                                    text={'You completed the mistery!\nPress any button to continue'}
                                    onPressOk={this.goHome.bind(this)}
                                    onPressCancel={this.goHome.bind(this)}
                                />
                            </View>
                        </Modal>
                    );
                } else if (this.state.modalVisible) {
                    return (
                        <Modal
                            isVisible={this.state.modalVisible}
                            backdropColor={'rgba(54,23,94,0.8)'}
                            backdropOpacity={0.5}
                        >
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Alert
                                    title={'Exit'}
                                    text={'Are you sure you want to leave?\nYou will lose your progress'}
                                    onPressCancel={this.onPressCancel.bind(this)}
                                    onPressOk={this.onPressOk.bind(this)}
                                />
                            </View>
                        </Modal>
                    );
                } else {
                    return (
                        <BarCodeScanner style={{ height: '100%', width: '100%' }} onBarCodeRead={this._handleBarCodeRead}>
                            <Notepad clues={this.state.clues} index={this.state.clueIndex} exitToApp={this.getMeOut.bind(this)} />
                        </BarCodeScanner>
                    );
                }
            }
        }
    }

    _handleBarCodeRead = ({ type, data }) => {
        const clue = this.state.clues[this.state.clueIndex];
        if (type === 256 || type === 'org.iso.QRCode') {
            if (clue.sol === data) {
                this.solvedClue();
            }
        }
    };

    goHome() {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Loading' })]
        });
        this.props.navigation.dispatch(resetAction);
    }

    onPressCancel() {
        this.setState({ modalVisible: false });
    }

    onPressOk() {
        this.goHome();
    }

    solvedClue() {
        // Indicador de que se resolvió, sonido o algo
        let index = this.state.clueIndex;
        index++;
        if (index === this.state.clues.length) {
            // Se terminó, llamar modal y de modal a Loading
            this.setState({ victoria: true });
        } else {
            this.setState({ clueIndex: index, GIF: true });
            setTimeout(() => this.setState({ GIF: false }), 6200);
        }
    }
}

const styles = {
    loadingView: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(54,23,94,0.8)',
        height: '100%',
        width: '100%'
    },
    loadingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f4f4f4'
    },
    errorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(54,23,94,0.8)',
        height: '100%',
        width: '100%'
    },
    errorText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red'
    },
    GIF: {
        resizeMode: 'contain',
        height: '100%',
        width: '100%'
    },
    gifContainer: {
        width: '100%',
        height: '100%'
    }
};

export default CameraScanner;