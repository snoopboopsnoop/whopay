import { StyleSheet, Text, View, Image, TouchableHighlight } from 'react-native';
import { Friend } from './App';
import { useNavigation } from '@react-navigation/native';

type FriendDisplayProps = {
    friend: Friend,
    color: string,
    height: number,
}

export default function FriendDisplay(props: FriendDisplayProps) {
    const navigation = useNavigation();

    return (
        <TouchableHighlight
            style={{backgroundColor: (props.color == '#EFEFEF') ? '#F6F6F6' : '#EFEFEF' }}
            onPress={ () =>
                navigation.navigate('FriendDetail')
            }
        >
            <View style={[styles.container, {backgroundColor: props.color, height: (props.height < 70) ? 70 : props.height}]}>
                <View style={styles.accContainer}>
                    <Image 
                        style={styles.pfp}
                        source={require('./assets/bucket-gorilla.jpg')}
                    />
                    <Text style={styles.accName}>
                        {props.friend.username}
                    </Text>
                </View>
                <View style={styles.moneyContainer}>
                    <Text style={[
                            styles.balanceText,
                            {color: (Number(props.friend.balance) == 0) ? '#9F9F9F' : (Number(props.friend.balance) > 0) ? '#28BC1B' : '#EE3B3B'}
                            ]}>
                        ${(Number(props.friend.balance) < 0) ? props.friend.balance.slice(1) : props.friend.balance}
                    </Text>
                    <Text style={styles.lastTransText}>
                        Last transaction:{' '}
                        {props.friend.lastTransaction.getMonth()+1}/{props.friend.lastTransaction.getDate()}/{props.friend.lastTransaction.getFullYear()%100}
                    </Text>
                </View>
            </View>
        </TouchableHighlight>
    );
}

const styles =  StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 55,
        paddingVertical: 13,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    pfp: {
        borderRadius: 10000,
        height: '100%',
        aspectRatio: 1,
    
    },
    accContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 7,
        gap: 4,
    },
    accName: {
        width: 77,
        height: 16,
        fontFamily: 'NunitoSans_400Regular',
        fontSize: 12,
        textAlign: 'center',
    },
    moneyContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 7,
        width: 117,
        height: '100%',
    },
    balanceText: {
        width: 117,
        height: 49,
        fontFamily: 'NunitoSans_400Regular',
        fontSize: 36,
        textAlign: 'center',
        padding: 0,
        lineHeight: 49,
    },
    lastTransText: {
        width: 117,
        height: 14,
        fontFamily: 'NunitoSans_400Regular',
        fontSize: 10,
        textAlign: 'center',
        color: '#696969',
    }
})