import { 
  NotebookStructure, 
  NotebookCell
} from '../utils/notebook';
import styles from './StructureProposal.module.scss';
import { CodeiumEditor } from "@codeium/react-code-editor";
import MDEditor from '@uiw/react-md-editor';

interface StructureProposalProps {
  structure: NotebookStructure;
  onFeedback: (feedback: string) => void;
  onConfirm: () => void;
  handleAddCell: () => void;
  handleCellTypeChange: (cellIndex: number, type: string) => void;
  handleCellChange: (cellIndex: number, content: string) => void;
  generateContent: (cellIndex: number, prompt: string) => void;
}

export const StructureProposal = ({ structure, onFeedback, onConfirm, handleAddCell, handleCellTypeChange, 
handleCellChange, generateContent}: StructureProposalProps) => {

  const RenderCell = (cell: NotebookCell, cellIndex: number) => {

    return (
      <div key={cellIndex} className={styles.cell}>
        <div className={styles.cellTypeAndContent}>
          <select
            value={cell.type}
            onChange={(e) => handleCellTypeChange(cellIndex, e.target.value)}
            className={styles.cellType}
          >
            <option value="markdown">Markdown</option>
            <option value="code">Code</option>
          </select>
          {cell.type.toLowerCase() === 'code' ? (
            <CodeiumEditor 
              language="python" 
              theme="vs-light"
              value={cell.content}
              onChange={(value) => handleCellChange(cellIndex, value || '')}
            />
          ) : (
            <MDEditor
              minHeight={500}
              value={cell.content}
              onChange={(value) => handleCellChange(cellIndex, value || '')}
              className={styles.contentInput}
              data-color-mode="light"
            />
          )}
          <button
            className={styles.addCellButton} 
            onClick={() => generateContent(cellIndex, cell.content)}>
            Generate Content
          </button>
        </div>
      </div>
    );
  };

  
  return (
    <div className={styles.structureProposalContainer}>
      <h2>{structure.notebook_name}</h2>
      <div className={styles.structureContent}>
        <h3>Proposed Notebook Structure</h3>
        {structure.cells.map((cell, index) => 
          RenderCell(cell, index)
        )}
        <button 
          onClick={handleAddCell}
          className={styles.addCellButton}
        >
          Add New Cell
        </button>
        <div className={styles.feedbackSection}>
          <textarea 
            placeholder="Provide feedback on the structure (optional)"
            className={styles.feedbackInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onFeedback((e.target as HTMLTextAreaElement).value);
              }
            }}
          />
          <div className={styles.actionButtons}>
            <button
              onClick={() => onFeedback(JSON.stringify(structure))}
              className={styles.feedbackButton}
            >
              Update Structure
            </button>
            <button 
              onClick={onConfirm}
              className={styles.confirmButton}
            >
              Confirm and Generate Notebook
            </button>
          </div>
        </div>
      </div>    
    </div>
  );
};
