import React, { Component } from "react";
import { Text, Image, View, StyleSheet, TouchableOpacity, Button } from "react-native";

import { BackHandler } from 'react-native';

export default class Home extends Component {
   
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        return false;
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={require('./LOGO-3.1-LARANJA.png')} style={styles.imagem} />
                <View style={styles.containerBTN}>
                    <View style={{ marginRight: 10 }}>
                        <Button
                            color='#FA7921'
                            title='ENTRAR'
                            onPress={() => this.props.navigation.navigate('Login')} />

                    </View>

                    <Button
                        color='#FA7921'
                        title='CRIAR CONTA'
                        onPress={() => this.props.navigation.navigate('Criar Conta')} />

                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#feddc7',
    },

    imagem: {
        flex: 10
    },

    containerBTN: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
    },

    margin: {
        margin: 10
    },

})