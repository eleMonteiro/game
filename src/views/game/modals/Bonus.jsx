import React, { Component } from "react";
import { Button, Image, StyleSheet, Text, View, } from "react-native";

import * as firebase from '../../../api/firebase'


export default class BonusScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            bonus: null,
        }
    }

    componentDidMount() {
        if (!this.state.bonus) {
            const min = 1;
            const max = 11;
            const filho = Math.floor(min + Math.random() * (max - min))

            const bonusRef = firebase.db.ref('bonus/').child(filho);
            bonusRef.on('value', (snapshot) => {
                this.setState({ bonus: snapshot.val() });
            })
        }
    }

    render() {
        const { bonus} = this.state
        return (
            <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#feddc7' }}>
                {
                    bonus &&
                    <>
                        <Image source={{ uri: bonus['url'] }} style={styles.imagem} />

                        <Button 
                            color='#1785C1'
                            title='VOLTAR'
                            onPress={() => this.props.navigation.goBack()}
                        />
                    </>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
        backgroundColor: '#feddc7',
    },

    containerBTN: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    imagem: {
        width: 400,
        height: 500,
    },

    button: {
        marginBottom: 30,
        width: 'auto',
        alignItems: 'center',
        backgroundColor: '#FA7921',
        borderRadius: 10,
        margin: 15
    },

    buttonText: {
        padding: 10,
        color: 'white',
        fontSize: 15
    },
})