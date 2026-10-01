async function saveCheck(complete = false) {
  if (!profile || !current) return;

  setSaving(true);
  setError('');

  try {
    const payload = {
      ...current,
      status: complete ? 'completed' : current.status === 'completed' ? 'completed' : 'draft',
      updated_at: new Date().toISOString(),
    };

    delete payload.id;
    delete payload.created_at;
    delete payload.updated_at;
    delete payload.volunteer;

    const { data, error } = await supabase
      .from('home_checks')
      .upsert(
        {
          ...payload,
          volunteer: profile.full_name,
        },
        { onConflict: 'id' }
      )
      .select('*')
      .single();

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    const checkId = data.id;

    setCurrent(data);

    // Save the answers
    await supabase
      .from('home_check_answers')
      .delete()
      .eq('home_check_id', checkId);

    const rows = answers
      .filter(a => a.answer || a.notes)
      .map(a => ({
        ...a,
        home_check_id: checkId,
      }));

    if (rows.length) {
      const { error: answerError } = await supabase
        .from('home_check_answers')
        .insert(rows);

      if (answerError) {
        setError(answerError.message);
        setSaving(false);
        return;
      }
    }

    // NOW upload any photos selected before Save
    if (pendingPhotos.length > 0) {
      for (const file of pendingPhotos) {
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `${checkId}/${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('home-check-photos')
          .upload(path, file, { upsert: false });

        if (uploadError) {
          setError(`Photo upload failed: ${uploadError.message}`);
          setSaving(false);
          return;
        }

        const { data: publicData } = supabase.storage
          .from('home-check-photos')
          .getPublicUrl(path);

        const publicUrl = publicData.publicUrl;

        const { data: insertedPhoto, error: insertError } = await supabase
          .from('home_check_photos')
          .insert({
            home_check_id: checkId,
            photo_url: publicUrl,
            photo_label: file.name,
          })
          .select()
          .single();

        if (insertError) {
          setError(`Photo record failed: ${insertError.message}`);
          setSaving(false);
          return;
        }

        if (insertedPhoto) {
          setPhotos(prev => [...prev, insertedPhoto]);
        }
      }

      // Clear the waiting photos only after they were successfully uploaded
      setPendingPhotos([]);
    }

    await loadChecks();

    setSaving(false);
    setTab(complete ? 'report' : 'dashboard');

  } catch (err: any) {
    console.error('SAVE CHECK ERROR:', err);
    setError(err?.message || 'Save failed');
    setSaving(false);
  }
}
