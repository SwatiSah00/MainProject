import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: 90,
    },
    listIconContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: 90,
    },
    addButton: {
        position: "absolute",
        zIndex: 11,
        right: 20,
        bottom: 90,
        backgroundColor: "blue",
        width: 90,
        height: 90,
        borderRadius: 59,
        alignItems: "center",
        justifyContent: "center",
        elevation: 8
    },
    addButtonText: {
        color: "#fff",
        fontSize: 12
    }
})