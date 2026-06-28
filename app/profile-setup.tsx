import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { createArtist } from '@/services/artistService';

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

export default function ProfileSetupScreen() {
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');
  const [bio, setBio] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [website, setWebsite] = useState('');
  const [nameError, setNameError] = useState<string | undefined>(undefined);

  const [status, setStatus] = useState<SaveStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const handleNameChange = (value: string) => {
    setName(value);
    if (nameError && value.trim().length > 0) {
      setNameError(undefined);
    }
  };

  const handleSave = async () => {
    if (name.trim().length === 0) {
      setNameError('Artist name is required.');
      return;
    }
    setNameError(undefined);
    setStatus('saving');
    setErrorMessage(undefined);

    try {
      await createArtist({ name, genre, bio, instagram, facebook, website });
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      );
    }
  };

  const isSaving = status === 'saving';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text variant="heading" style={styles.title}>
        Your Artist Profile
      </Text>

      <Input
        label="Artist Name"
        required
        value={name}
        onChangeText={handleNameChange}
        error={nameError}
        placeholder="e.g. Jordan Quartet"
        autoCapitalize="words"
        returnKeyType="next"
        editable={!isSaving}
      />

      <Input
        label="Genre"
        value={genre}
        onChangeText={setGenre}
        placeholder="e.g. Jazz, Folk, Rock"
        editable={!isSaving}
      />

      <Input
        label="Bio"
        value={bio}
        onChangeText={setBio}
        placeholder="Tell fans about your music"
        multiline
        editable={!isSaving}
      />

      <Input
        label="Instagram"
        value={instagram}
        onChangeText={setInstagram}
        placeholder="@username"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isSaving}
      />

      <Input
        label="Facebook"
        value={facebook}
        onChangeText={setFacebook}
        placeholder="facebook.com/yourpage"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isSaving}
      />

      <Input
        label="Website"
        value={website}
        onChangeText={setWebsite}
        placeholder="https://yourband.com"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        editable={!isSaving}
      />

      <Button
        label={isSaving ? 'Saving…' : 'Save Profile'}
        variant="primary"
        onPress={handleSave}
        disabled={isSaving}
        style={styles.save}
      />

      {status === 'success' ? (
        <Text variant="body" color={colors.primary} style={styles.message}>
          Profile saved.
        </Text>
      ) : null}

      {status === 'error' ? (
        <Text variant="body" color={colors.danger} style={styles.message}>
          {errorMessage}
        </Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    marginBottom: spacing.lg,
  },
  save: {
    marginTop: spacing.sm,
  },
  message: {
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
