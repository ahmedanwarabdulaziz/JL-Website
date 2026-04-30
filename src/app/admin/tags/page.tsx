"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import CollectionsIcon from "@mui/icons-material/Collections";
import { useAuth } from "@/contexts/AuthContext";
import type { TagCategory, Tag, StoredImage, UpholsteryPiece } from "@/lib/firestore";
import {
  getTagCategories,
  getTags,
  createTagCategory,
  createTag,
  updateTagCategory,
  updateTag,
  deleteTagCategory,
  deleteTag,
  getUpholsteryPieces,
  type TagCategoryType,
  type TagCategorySelection,
} from "@/lib/firestore";

export default function AdminTagsPage() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const [categories, setCategories] = useState<TagCategory[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState<TagCategoryType>("mandatory");
  const [categorySelection, setCategorySelection] = useState<TagCategorySelection>("single");
  const [tagCategoryId, setTagCategoryId] = useState("");
  const [tagLabel, setTagLabel] = useState("");
  const [saving, setSaving] = useState(false);

  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryType, setEditCategoryType] = useState<TagCategoryType>("mandatory");
  const [editCategorySelection, setEditCategorySelection] = useState<TagCategorySelection>("single");

  const [editTagId, setEditTagId] = useState<string | null>(null);
  const [editTagLabel, setEditTagLabel] = useState("");
  const [editTagCategoryId, setEditTagCategoryId] = useState("");
  const [editTagFeaturedImages, setEditTagFeaturedImages] = useState<StoredImage[]>([]);
  const [uploadingTagImage, setUploadingTagImage] = useState(false);

  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [deleteTagId, setDeleteTagId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryPieces, setLibraryPieces] = useState<UpholsteryPiece[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [libraryFilterTagId, setLibraryFilterTagId] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) {
      router.replace("/login");
      return;
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (!user || !isAdmin) return;
    (async () => {
      setLoading(true);
      try {
        const [cats, allTags] = await Promise.all([getTagCategories(), getTags()]);
        setCategories(cats);
        setTags(allTags);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, isAdmin]);

  const loadData = async () => {
    const [cats, allTags] = await Promise.all([getTagCategories(), getTags()]);
    setCategories(cats);
    setTags(allTags);
  };

  const openEditCategory = (c: TagCategory) => {
    setEditCategoryId(c.id);
    setEditCategoryName(c.name);
    setEditCategoryType(c.type);
    setEditCategorySelection(c.selection);
  };

  const handleSaveEditCategory = async () => {
    if (!editCategoryId || !editCategoryName.trim()) return;
    setSaving(true);
    try {
      await updateTagCategory(editCategoryId, {
        name: editCategoryName.trim(),
        type: editCategoryType,
        selection: editCategorySelection,
      });
      await loadData();
      setEditCategoryId(null);
    } finally {
      setSaving(false);
    }
  };

  const openEditTag = (t: Tag) => {
    setEditTagId(t.id);
    setEditTagLabel(t.label);
    setEditTagCategoryId(t.categoryId);
    setEditTagFeaturedImages(t.featuredImages || []);
  };

  const handleSaveEditTag = async () => {
    if (!editTagId || !editTagLabel.trim() || !editTagCategoryId) return;
    setSaving(true);
    try {
      await updateTag(editTagId, { 
        label: editTagLabel.trim(), 
        categoryId: editTagCategoryId,
        featuredImages: editTagFeaturedImages
      });
      await loadData();
      setEditTagId(null);
    } finally {
      setSaving(false);
    }
  };

  const handleTagImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (editTagFeaturedImages.length >= 5) {
      alert("Maximum 5 featured images allowed per tag.");
      return;
    }
    setUploadingTagImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      
      const newImage: StoredImage = {
        storageKey: data.storageKey,
        publicUrl: data.publicUrl,
        thumbnailUrl: data.thumbnailUrl,
      };
      setEditTagFeaturedImages(prev => [...prev, newImage]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingTagImage(false);
      // Reset the file input so the same file could be selected again if needed
      e.target.value = "";
    }
  };

  const removeTagImage = (index: number) => {
    setEditTagFeaturedImages(prev => prev.filter((_, i) => i !== index));
  };

  const makeCoverImage = (index: number) => {
    if (index === 0) return;
    setEditTagFeaturedImages(prev => {
      const newImages = [...prev];
      const selected = newImages.splice(index, 1)[0];
      newImages.unshift(selected);
      return newImages;
    });
  };

  const openLibrary = async () => {
    setLibraryOpen(true);
    if (libraryPieces.length === 0) {
      setLibraryLoading(true);
      try {
        const p = await getUpholsteryPieces();
        setLibraryPieces(p);
      } catch (err) {
        console.error("Failed to load pieces", err);
      } finally {
        setLibraryLoading(false);
      }
    }
  };

  const addImageFromLibrary = (piece: UpholsteryPiece) => {
    if (editTagFeaturedImages.length >= 5) {
      alert("Maximum 5 featured images allowed per tag.");
      return;
    }
    const exists = editTagFeaturedImages.some(img => img.storageKey === piece.storageKey);
    if (exists) {
      alert("Image is already added.");
      return;
    }
    const newImage: StoredImage = {
      storageKey: piece.storageKey,
      publicUrl: piece.publicUrl,
      thumbnailUrl: piece.thumbnailUrl,
    };
    setEditTagFeaturedImages(prev => [...prev, newImage]);
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryId) return;
    setDeleting(true);
    try {
      await deleteTagCategory(deleteCategoryId);
      await loadData();
      setDeleteCategoryId(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteTag = async () => {
    if (!deleteTagId) return;
    setDeleting(true);
    try {
      await deleteTag(deleteTagId);
      await loadData();
      setDeleteTagId(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) return;
    setSaving(true);
    try {
      const order = categories.length;
      await createTagCategory({
        name: categoryName.trim(),
        type: categoryType,
        selection: categorySelection,
        order,
      });
      await loadData();
      setCategoryName("");
      setCategoryOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const openAddTag = (preselectCategoryId?: string) => {
    if (preselectCategoryId) setTagCategoryId(preselectCategoryId);
    setTagLabel("");
    setTagOpen(true);
  };

  const handleCreateTag = async () => {
    if (!tagLabel.trim() || !tagCategoryId) return;
    setSaving(true);
    try {
      await createTag({ categoryId: tagCategoryId, label: tagLabel.trim() });
      await loadData();
      setTagLabel("");
      setTagOpen(false);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user || !isAdmin) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  const tagsByCategory = categories.map((c) => ({
    category: c,
    tags: tags.filter((t) => t.categoryId === c.id),
  }));

  return (
    <>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Typography
        component="h1"
        variant="h5"
        fontWeight={600}
        sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
      >
        Tag system
      </Typography>

      {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Button
                variant="contained"
                onClick={() => setCategoryOpen(true)}
                sx={{ minHeight: 44 }}
              >
                Add category
              </Button>
              <Button
                variant="outlined"
                onClick={() => openAddTag()}
                disabled={categories.length === 0}
                sx={{ minHeight: 44 }}
              >
                Add tag
              </Button>
            </Stack>

            <List dense sx={{ flex: 1 }}>
              {tagsByCategory.map(({ category, tags: catTags }) => (
                <ListItem key={category.id} sx={{ flexDirection: "column", alignItems: "stretch", py: 1.5 }}>
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" gap={0.5} flexWrap="wrap">
                        <Typography fontWeight={600}>{category.name}</Typography>
                        <Chip label={category.type} size="small" variant="outlined" />
                        <Chip label={category.selection} size="small" variant="outlined" />
                        <Tooltip title="Edit category">
                          <IconButton
                            color="primary"
                            onClick={() => openEditCategory(category)}
                            size="small"
                            sx={{ minWidth: 44, minHeight: 44 }}
                            aria-label={`Edit ${category.name}`}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete category">
                          <IconButton
                            color="error"
                            onClick={() => setDeleteCategoryId(category.id)}
                            size="small"
                            sx={{ minWidth: 44, minHeight: 44 }}
                            aria-label={`Delete ${category.name}`}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Add tag to this category">
                          <IconButton
                            color="primary"
                            onClick={() => openAddTag(category.id)}
                            size="small"
                            sx={{ minWidth: 44, minHeight: 44 }}
                            aria-label={`Add tag to ${category.name}`}
                          >
                            <AddCircleOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    }
                    secondary={
                      <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 0.5 }} alignItems="center">
                        {catTags.length === 0 ? (
                          <Typography variant="body2" color="text.secondary">No tags yet</Typography>
                        ) : (
                          catTags.map((t) => (
                            <Chip
                              key={t.id}
                              label={t.label}
                              size="small"
                              onClick={() => openEditTag(t)}
                              onDelete={() => setDeleteTagId(t.id)}
                              sx={{ cursor: "pointer" }}
                            />
                          ))
                        )}
                      </Stack>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
    </Box>

      <Dialog open={categoryOpen} onClose={() => setCategoryOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Add category</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              fullWidth
              autoFocus
              slotProps={{ input: { style: { minHeight: 44 } } }}
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={categoryType}
                label="Type"
                onChange={(e) => setCategoryType(e.target.value as TagCategoryType)}
                slotProps={{ input: { style: { minHeight: 44 } } }}
              >
                <MenuItem value="mandatory">Mandatory</MenuItem>
                <MenuItem value="optional">Optional</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Selection</InputLabel>
              <Select
                value={categorySelection}
                label="Selection"
                onChange={(e) => setCategorySelection(e.target.value as TagCategorySelection)}
                slotProps={{ input: { style: { minHeight: 44 } } }}
              >
                <MenuItem value="single">Single</MenuItem>
                <MenuItem value="multiple">Multiple</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={() => setCategoryOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateCategory} disabled={saving || !categoryName.trim()}>
            {saving ? <CircularProgress size={20} /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={tagOpen} onClose={() => setTagOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>
          Add tag{tagCategoryId ? ` to ${categories.find((c) => c.id === tagCategoryId)?.name ?? ""}` : ""}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={tagCategoryId}
                label="Category"
                onChange={(e) => setTagCategoryId(e.target.value)}
                slotProps={{ input: { style: { minHeight: 44 } } }}
              >
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Tag label"
              value={tagLabel}
              onChange={(e) => setTagLabel(e.target.value)}
              fullWidth
              slotProps={{ input: { style: { minHeight: 44 } } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={() => setTagOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateTag} disabled={saving || !tagLabel.trim() || !tagCategoryId}>
            {saving ? <CircularProgress size={20} /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editCategoryId !== null} onClose={() => setEditCategoryId(null)} fullWidth maxWidth="xs">
        <DialogTitle>Edit category</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Name"
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
              fullWidth
              autoFocus
              slotProps={{ input: { style: { minHeight: 44 } } }}
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={editCategoryType}
                label="Type"
                onChange={(e) => setEditCategoryType(e.target.value as TagCategoryType)}
                slotProps={{ input: { style: { minHeight: 44 } } }}
              >
                <MenuItem value="mandatory">Mandatory</MenuItem>
                <MenuItem value="optional">Optional</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Selection</InputLabel>
              <Select
                value={editCategorySelection}
                label="Selection"
                onChange={(e) => setEditCategorySelection(e.target.value as TagCategorySelection)}
                slotProps={{ input: { style: { minHeight: 44 } } }}
              >
                <MenuItem value="single">Single</MenuItem>
                <MenuItem value="multiple">Multiple</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={() => setEditCategoryId(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEditCategory} disabled={saving || !editCategoryName.trim()}>
            {saving ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editTagId !== null} onClose={() => setEditTagId(null)} fullWidth maxWidth="xs">
        <DialogTitle>Edit tag</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={editTagCategoryId}
                label="Category"
                onChange={(e) => setEditTagCategoryId(e.target.value)}
                slotProps={{ input: { style: { minHeight: 44 } } }}
              >
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Tag label"
              value={editTagLabel}
              onChange={(e) => setEditTagLabel(e.target.value)}
              fullWidth
              slotProps={{ input: { style: { minHeight: 44 } } }}
            />
            {/* Featured Images Uploader */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Featured Images (Optional, max 5)
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 1.5 }}>
                {editTagFeaturedImages.map((img, i) => (
                  <Box key={i} sx={{ position: "relative", width: 80, height: 80, borderRadius: 1, overflow: "hidden", border: i === 0 ? "2px solid #f9c349" : "1px solid #ddd" }}>
                    <Box component="img" src={img.thumbnailUrl || img.publicUrl} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <Tooltip title={i === 0 ? "Current Cover" : "Make Cover"}>
                      <IconButton
                        size="small"
                        onClick={() => makeCoverImage(i)}
                        sx={{ position: "absolute", top: 2, left: 2, bgcolor: "rgba(255,255,255,0.8)", "&:hover": { bgcolor: "white" } }}
                      >
                        <StarIcon fontSize="inherit" sx={{ color: i === 0 ? "#f9c349" : "action.disabled" }} />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeTagImage(i)}
                      sx={{ position: "absolute", bottom: 2, right: 2, bgcolor: "rgba(255,255,255,0.8)", "&:hover": { bgcolor: "white" } }}
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                ))}
                {editTagFeaturedImages.length < 5 && (
                  <Stack direction="row" gap={1}>
                    <Button
                      component="label"
                      variant="outlined"
                      sx={{ width: 80, height: 80, flexDirection: "column", gap: 0.5 }}
                      disabled={uploadingTagImage}
                    >
                      {uploadingTagImage ? (
                        <CircularProgress size={24} />
                      ) : (
                        <>
                          <AddCircleOutlineIcon color="action" />
                          <Typography variant="caption" color="text.secondary">Upload</Typography>
                        </>
                      )}
                      <input type="file" accept="image/*" hidden onChange={handleTagImageUpload} />
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={openLibrary}
                      sx={{ width: 80, height: 80, flexDirection: "column", gap: 0.5 }}
                    >
                      <CollectionsIcon color="action" />
                      <Typography variant="caption" color="text.secondary">Library</Typography>
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={() => setEditTagId(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEditTag} disabled={saving || !editTagLabel.trim() || !editTagCategoryId}>
            {saving ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteCategoryId !== null} onClose={() => setDeleteCategoryId(null)}>
        <DialogTitle>Delete category?</DialogTitle>
        <DialogContent>
          <Typography>
            This will delete the category and all tags inside it. Pieces that use these tags will keep the tag IDs but the tags will no longer exist. This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={() => setDeleteCategoryId(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteCategory} disabled={deleting}>
            {deleting ? <CircularProgress size={20} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteTagId !== null} onClose={() => setDeleteTagId(null)}>
        <DialogTitle>Delete tag?</DialogTitle>
        <DialogContent>
          <Typography>Pieces that use this tag will keep the tag ID but the tag will no longer exist. This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={() => setDeleteTagId(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteTag} disabled={deleting}>
            {deleting ? <CircularProgress size={20} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={libraryOpen} onClose={() => setLibraryOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Browse Image Library</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
             <FormControl fullWidth size="small">
               <InputLabel>Filter by Tag</InputLabel>
               <Select
                 value={libraryFilterTagId}
                 label="Filter by Tag"
                 onChange={(e) => setLibraryFilterTagId(e.target.value)}
               >
                 <MenuItem value=""><em>All Tags</em></MenuItem>
                 {categories.map((c) => {
                   const catsTags = tags.filter(t => t.categoryId === c.id);
                   if (catsTags.length === 0) return null;
                   return [
                     <MenuItem disabled key={`cat-${c.id}`} sx={{ fontWeight: 'bold' }}>{c.name}</MenuItem>,
                     ...catsTags.map(t => <MenuItem key={t.id} value={t.id} sx={{ pl: 4 }}>{t.label}</MenuItem>)
                   ];
                 })}
               </Select>
             </FormControl>
          </Box>
          
          {libraryLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress /></Box>
          ) : (
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 2 }}>
               {libraryPieces
                 .filter(p => libraryFilterTagId ? p.tagIds.includes(libraryFilterTagId) : true)
                 .map(p => {
                    const isAdded = editTagFeaturedImages.some(img => img.storageKey === p.storageKey);
                    return (
                     <Box 
                       key={p.id} 
                       onClick={() => {
                         if (!isAdded) addImageFromLibrary(p);
                       }}
                       sx={{ 
                         aspectRatio: '1', 
                         borderRadius: 1, 
                         overflow: 'hidden', 
                         cursor: isAdded ? 'default' : 'pointer',
                         border: isAdded ? '2px solid var(--brand-orange)' : '1px solid #ddd',
                         opacity: isAdded ? 0.6 : 1,
                         position: 'relative',
                         "&:hover img": {
                           transform: isAdded ? 'none' : 'scale(1.05)'
                         }
                       }}
                     >
                       <Box component="img" src={p.thumbnailUrl || p.publicUrl} sx={{ width: "100%", height: "100%", objectFit: "cover", transition: 'transform 0.3s' }} />
                       {isAdded && (
                         <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.7)' }}>
                           <Typography variant="caption" fontWeight="bold" color="primary">Added</Typography>
                         </Box>
                       )}
                     </Box>
                    );
               })}
               {libraryPieces.length > 0 && libraryPieces.filter(p => libraryFilterTagId ? p.tagIds.includes(libraryFilterTagId) : true).length === 0 && (
                 <Typography color="text.secondary" sx={{ gridColumn: '1 / -1', py: 2, textAlign: 'center' }}>No pieces match this tag filter.</Typography>
               )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLibraryOpen(false)}>Done</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
