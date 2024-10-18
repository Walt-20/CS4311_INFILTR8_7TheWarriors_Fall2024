import { readFile } from 'fs/promises';
import path from 'path';
import { marked } from 'marked';
 
export async function load() {
    const filePath = path.resolve('README.md');
    try {
        const content = await readFile(filePath, 'utf-8');
        const htmlContent = marked(content);
        return { file:content };
    } catch (error) {
        console.error('Error reading README.md:', error);
        return { content: 'Error loading README file.' };
    }
}