import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';

// Form component for creating and editing TODO items.
// This component is intentionally stateless with respect to the TODO list itself;
// it notifies the parent via callbacks when the user submits or cancels.

export interface TodoFormValues {
  title: string;
  description?: string;
  deadlineDate?: string;
  category?: string;
  isCompleted?: boolean;
}

export interface TodoFormProps {
  mode: 'create' | 'edit';
  initialValues?: TodoFormValues;
  onSubmit: (values: TodoFormValues) => void;
  onCancelEdit?: () => void;
}

export function TodoForm({ mode, initialValues, onSubmit, onCancelEdit }: TodoFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [deadlineDate, setDeadlineDate] = useState(initialValues?.deadlineDate ?? '');
  const [category, setCategory] = useState(initialValues?.category ?? '');

  useEffect(() => {
    // When initial values change (e.g. user picks a different item to edit),
    // make sure the form fields reflect the selected item.
    if (initialValues) {
      setTitle(initialValues.title ?? '');
      setDescription(initialValues.description ?? '');
      setDeadlineDate(initialValues.deadlineDate ?? '');
      setCategory(initialValues.category ?? '');
    } else {
      setTitle('');
      setDescription('');
      setDeadlineDate('');
      setCategory('');
    }
  }, [initialValues]);

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }

    onSubmit({
      title: trimmed,
      description: description.trim() || undefined,
      deadlineDate: deadlineDate.trim() || undefined,
      category: category.trim() || undefined,
    });
  };

  const handleCancel = () => {
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const isEditing = mode === 'edit';

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="What do you need to get done?"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Optional description"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, styles.multilineInput]}
        multiline
      />
      <TextInput
        placeholder="Deadline date (optional)"
        value={deadlineDate}
        onChangeText={setDeadlineDate}
        style={styles.input}
      />
      <TextInput
        placeholder="Category (optional)"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />
      <View style={styles.actionsRow}>
        {isEditing && (
          <Button label="Cancel" onPress={handleCancel} style={styles.secondaryButton} />
        )}
        <Button
          label={isEditing ? 'Save changes' : 'Add task'}
          onPress={handleSubmit}
          disabled={!title.trim()}
          style={styles.primaryButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  input: {
    borderColor: '#e1e1e1',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  secondaryButton: {
    backgroundColor: '#f5f5f5',
  },
  primaryButton: {
    backgroundColor: '#6362F9',
  },
});



