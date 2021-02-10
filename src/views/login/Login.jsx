import React, { Component } from "react";
import { Text, TextInput, Image, View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import * as firebase from '../../api/firebase'

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = { email: '', password: '', loading: false }

        this.login = this.login.bind(this)
    }

    async login() {
        await firebase.auth.signInWithEmailAndPassword(this.state.email, this.state.password)
            .then((user) => {
                this.setState({ loading: false })
                this.props.navigation.navigate('Room')
            })
            .catch((error) => {
                this.setState({ loading: false })
                Alert.alert('Não foi possivel realizar login!')
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../home/LOGO-3.1-LARANJA.png')} style={styles.imagem} />

                <ActivityIndicator animating={this.state.loading} size="small" color="#FA7921" />

                
                <TextInput
                    style={styles.textInput}
                    onChangeText={(email) => this.setState({ email })}
                    placeholder="Email"
                    textContentType="emailAddress"
                />

                <TextInput
                    style={styles.textInput}
                    onChangeText={(password) => this.setState({ password })}
                    placeholder="Senha"
                    textContentType="password"
                    type="password"
                    secureTextEntry={true}
                />

                <View style={styles.containerBTN}>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({ loading: true })
                            this.login()
                        }}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>ENTRAR</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Classifiqui')}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>CANCELAR</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#feddc7'
    },

    containerBTN: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
    },

    imagem: {
        width: 100,
        height: 200,
    },

    button: {
        width: 'auto',
        alignItems: 'center',
        backgroundColor: '#FA7921',
        margin: 10
    },

    buttonText: {
        padding: 10,
        color: 'white',
        fontSize: 15
    },

    textInput: {
        height: 45,
        width: "80%",
        borderColor: "#fa7921",
        borderWidth: 2,
        paddingLeft: 20,
        color: '#111111',
        margin: 10
    },
})