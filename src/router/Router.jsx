import React, { Component } from 'react'
import { Alert, Button, StyleSheet } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Home from '../views/home/Home'
import Login from '../views/login/Login'
import CriarConta from '../views/login/CriarConta'
import Initial from '../views/initial/Initial'
import Game from '../views/game/Game'
import Room from '../views/room/Room'

import Classificar from '../views/game/modals/Classificar'
import Ajuda from '../views/game/modals/Ajuda'
import Bonus from '../views/game/modals/Bonus'

const Stack = createStackNavigator();

import * as firebase from '../api/firebase'

export default class Router extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const estiloCabecalho = {
            headerTitle: 'Classifiqui',
            headerStyle: {
                backgroundColor: '#fa7921',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            headerLeft: null,
        }

        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Classifiqui" component={Home} options={estiloCabecalho} />
                    <Stack.Screen name="Login" component={Login} options={estiloCabecalho} />
                    <Stack.Screen name="Criar Conta" component={CriarConta} options={estiloCabecalho} />


                    <Stack.Screen
                        name="Inicial"
                        component={Initial}
                        options={
                            {
                                headerTitle: 'Classifiqui',
                                headerStyle: {
                                    backgroundColor: '#fa7921',
                                },
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                },
                                headerLeft: null,
                            }
                        }
                    />

                    <Stack.Screen
                        name="Game"
                        component={Game}
                        options={
                            {
                                headerTitle: 'Classifiqui',
                                headerStyle: {
                                    backgroundColor: '#fa7921',
                                },
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                },
                                headerLeft: null,
                            }
                        }

                    />

                    <Stack.Screen
                        name="Room"
                        component={Room}
                        options={
                            {
                                headerTitle: 'Classifiqui',
                                headerStyle: {
                                    backgroundColor: '#fa7921',
                                },
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                },
                                headerLeft: null,
                            }
                        }
                    />

                    <Stack.Screen
                        name="Classificar"
                        component={Classificar}
                        options={
                            {
                                headerTitle: 'Classifiqui',
                                headerStyle: {
                                    backgroundColor: '#fa7921',
                                },
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                }
                            }
                        }
                    />

                    <Stack.Screen
                        name="Ajuda"
                        component={Ajuda}
                        options={
                            {
                                headerTitle: 'Classifiqui',
                                headerStyle: {
                                    backgroundColor: '#fa7921',
                                },
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                }
                            }
                        }
                    />

                    <Stack.Screen
                        name="Bonus"
                        component={Bonus}
                        options={
                            {
                                headerTitle: 'Classifiqui',
                                headerStyle: {
                                    backgroundColor: '#fa7921',
                                },
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                }
                            }
                        }
                    />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    header: {
        backgroundColor: '#fa7921'
    }
});
