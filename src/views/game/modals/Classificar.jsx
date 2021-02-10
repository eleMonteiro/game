import React, { Component } from 'react'
import Swiper from 'react-native-deck-swiper'
import { Alert, Button, Image, StyleSheet, Text, View } from 'react-native'

const Item = ({ user, tipo, title, url, mudarVez, vez, classificarRequisito, req }) => (
    <View>
        <Image source={{ uri: url }} style={styles.imagem}></Image>
        <Button
            title='CLASSIFICAR'
            onPress={
                () => {
                    Alert.alert(
                        "Classificar como " + title,
                        "",
                        [
                            {
                                text: "Cancel",
                                onPress: () => {
                                    classificarRequisito(req, tipo, user)
                                },
                                style: "cancel"
                            },
                            { text: "OK", onPress: () => mudarVez(vez) }
                        ],
                        { cancelable: false }
                    )
                }
            }
        ></Button>
    </View>
);

export default class ModalClassificar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            cards: this.props.route.params.tipos,
            swipedAllCards: false,
            swipeDirection: '',
            cardIndex: 0,
        }
    }

    renderCard = (card) => {
        return (
            <Item
                user={this.props.route.params.user}
                tipo={card.tipo}
                title={card.text}
                url={card.url}
                mudarVez={this.props.route.params.mudarVez}
                vez={this.props.route.params.vez}
                req={this.props.route.params.req}
                classificarRequisito={this.props.route.params.classificarRequisito}
            />
        )
    };

    onSwipedAllCards = () => {
        this.setState({
            swipedAllCards: true
        })
    };

    render() {
        return (
            <View style={styles.container}>
                <Swiper
                    ref={swiper => {
                        this.swiper = swiper
                    }}
                    containerStyle={styles.cardContainer}
                    onSwiped={() => console.log('')}
                    onSwipedLeft={() => console.log('')}
                    onSwipedRight={() => console.log('')}
                    onSwipedTop={() => console.log('')}
                    onSwipedBottom={() => console.log('')}
                    onTapCard={() => { }}
                    cards={this.state.cards}
                    cardIndex={this.state.cardIndex}
                    cardVerticalMargin={80}
                    renderCard={this.renderCard}
                    onSwipedAll={this.onSwipedAllCards}
                    stackSize={3}
                    stackSeparation={15}
                    animateOverlayLabelsOpacity
                    animateCardOpacity
                    swipeBackCard
                >
                    <Button onPress={() => this.swiper.swipeBack()} color='#1785C1' title='VOLTAR CARTA' />

                </Swiper>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'stretch',
        backgroundColor: '#feddc7',
    },

    cardContainer: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'space-around',
        backgroundColor: '#feddc7',
    },

    card: {
        width: '100%',
        height: '100%',
        borderRadius: 5,

        justifyContent: 'center',
        alignItems: 'center',
    },

    imagem: {
        width: '100%',
        height: 500,
    },

})