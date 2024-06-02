package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

type Note struct {
	Path  string
	Title string
	Body  string
}

func generateHash(s string) string {
	return s
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) CloseApp() {
	runtime.Quit(a.ctx)
}

func (a *App) MaximiseApp() {
	if runtime.WindowIsMaximised(a.ctx) {
		runtime.WindowUnmaximise(a.ctx)
	} else {
		runtime.WindowMaximise(a.ctx)

	}
}

func (a *App) MinimiseApp() {
	runtime.WindowMinimise(a.ctx)
}

func (a *App) FilesInDirectory(dir string) ([]string, error) {
	var fileRoutes []string

	// Función auxiliar para caminar recursivamente por los directorios.
	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		// Si no es un directorio y tiene la extensión .md, añade la ruta a la lista.
		if !info.IsDir() && strings.HasSuffix(info.Name(), ".md") {
			fileRoutes = append(fileRoutes, path)
		}
		return nil
	})

	if err != nil {
		return nil, err
	}

	return fileRoutes, nil
}

func (a *App) FindNotesByFilename(searchText string) ([]Note, error) {
	var notes []Note

	// Función auxiliar para caminar recursivamente por los directorios.
	filepath.Walk("./", func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		// Si no es un directorio y el nombre del archivo contiene el texto de búsqueda, procesar el archivo.
		if !info.IsDir() && (strings.Contains(info.Name(), searchText) || strings.Contains(path, searchText)) && strings.HasSuffix(info.Name(), ".md") {
			// Leer el contenido del archivo.
			content, err := os.ReadFile(path)
			if err != nil {
				return err
			}

			// Crear una nueva nota.
			note := Note{
				Path:  path,            // Generar un hash del path.
				Title: info.Name(),     // El nombre del archivo.
				Body:  string(content), // El contenido del archivo.
			}

			// Añadir la nota a la lista.
			notes = append(notes, note)
		}
		return nil
	})

	return notes, nil
}

// OpenFileByDirectory abre y lee el contenido de un archivo, retornando una Note.
func (a *App) OpenFileByDirectory(filePath string) (*Note, error) {
	content, err := os.ReadFile(filePath)
	if err != nil {
		return nil, err
	}
	info, err := os.Stat(filePath)
	if err != nil {
		return nil, err
	}
	return &Note{
		Path:  generateHash(filePath),
		Title: info.Name(),
		Body:  string(content),
	}, nil
}

// CreateFileByDirectory crea un archivo con el contenido especificado y retorna una Note.
func (a *App) CreateFileByDirectory(filePath, content string) (*Note, error) {
	// Crear el directorio si no existe.
	dir := filepath.Dir(filePath)
	if err := os.MkdirAll(dir, os.ModePerm); err != nil {
		return nil, err
	}

	// Crear y escribir el archivo.
	err := os.WriteFile(filePath, []byte(content), 0644)
	if err != nil {
		return nil, err
	}

	// Crear la nota y retornarla.
	return &Note{
		Path:  generateHash(filePath),
		Title: filepath.Base(filePath),
		Body:  content,
	}, nil
}

// UpdateFileByDirectory actualiza el contenido de un archivo existente y retorna una Note.
func (a *App) UpdateFileByDirectory(path, newPath string, content string) (*Note, error) {
	// Verificar si el archivo existe.
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return nil, fmt.Errorf("el archivo %s no existe", path)
	}

	newDir := filepath.Dir(newPath)
	err := os.MkdirAll(newDir, 0755)
	if err != nil {
		return nil, err
	}

	// Actualizar el contenido del archivo.
	err = os.WriteFile(path, []byte(content), 0644)
	if err != nil {
		return nil, err
	}

	err = os.Rename(path, newPath)

	if err != nil {
		return nil, err
	}
	// Crear la nota y retornarla.
	return &Note{
		Path:  newPath,
		Title: filepath.Base(newPath),
		Body:  content,
	}, nil
}

// DeleteFileByDirectory elimina un archivo especificado y retorna una Note con el contenido previo a la eliminación.
func (a *App) DeleteFileByDirectory(filePath string) (*Note, error) {
	// Leer el contenido del archivo antes de eliminarlo.
	content, err := os.ReadFile(filePath)
	if err != nil {
		return nil, err
	}

	// Obtener la información del archivo.
	info, err := os.Stat(filePath)
	if err != nil {
		return nil, err
	}

	// Eliminar el archivo.
	err = os.Remove(filePath)
	if err != nil {
		return nil, err
	}

	// Crear la nota y retornarla.
	return &Note{
		Path:  generateHash(filePath),
		Title: info.Name(),
		Body:  string(content),
	}, nil
}
