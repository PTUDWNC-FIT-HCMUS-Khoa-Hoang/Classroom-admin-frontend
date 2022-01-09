import React from 'react';
import styled from 'styled-components';

const Table = styled.table`
  width: '100%';
  text-align: center;
`;

const TableData = styled.td`
  border: 1px solid black;
`;

const TableHeader = styled.th`
  border: 1px solid black;
`;

export default function StudentList({ classroom }) {
  console.log(
    '🚀 ~ file: StudentList.jsx ~ line 4 ~ StudentList ~ classroom',
    classroom
  );

  const filterGrade = (studentId, gradeId) => {
    return classroom.gradeBoard.find(
      (gradeDetail) =>
        gradeDetail.studentId === studentId && gradeDetail.gradeId === gradeId
    );
  };

  return (
    <div>
      <Table style={{ width: '100%', textAlign: 'center' }}>
        <thead>
          <tr>
            <TableHeader></TableHeader>
            {classroom.gradeStructure.map((gradeDetail) => (
              <TableHeader>{gradeDetail.title}</TableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {classroom.studentList.map((student) => (
            <tr>
              <TableHeader>{student.studentId}</TableHeader>
              {classroom.gradeStructure.map((gradeDetail) => (
                <TableData key={`grade-${gradeDetail._id}`}>
                  {filterGrade(student.studentId, gradeDetail._id).grade}
                </TableData>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
