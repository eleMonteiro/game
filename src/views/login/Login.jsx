import React, { Component } from "react";
import { Text, TextInput, Image, View, StyleSheet, Alert, ActivityIndicator, Button } from "react-native";
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
                <View style={styles.containerImagem}>

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
                        <Button
                            color='#FA7921'
                            title='ENTRAR'
                            onPress={
                                () => {
                                    this.setState({ loading: true })
                                    this.login()
                                }
                            }
                        />

                        <View style={{ margin: 10 }}></View>

                        <Button
                            color='#FA7921'
                            title='CANCELAR'
                            onPress={
                                () => this.props.navigation.navigate('Classifiqui')
                            }
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'space-around',
        backgroundColor: '#ffffff',
    },

    containerBTN: {
        width: "80%",
        alignItems: 'stretch',
    },

    containerImagem: {
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 5
    },

    imagem: {
        width: '40%',
        height: '40%',
    },

    textInput: {
        height: 45,
        width: "80%",
        borderColor: "#fa7921",
        borderWidth: 2,
        paddingLeft: 20,
        color: '#111111'
    },
})