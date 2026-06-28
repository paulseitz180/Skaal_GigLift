import { StyleSheet, Text, View } from 'react-native';

type PlaceholderScreenProps = {
  name: string;
};

export function PlaceholderScreen({ name }: PlaceholderScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
  },
});
